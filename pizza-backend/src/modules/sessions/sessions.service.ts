import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ISessionsService } from './sessions';
import { PrismaService } from 'src/libs/services/prisma.service';
import { Session } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Redis } from 'ioredis';
import { InternalJwtService } from '../internal-jwt/internal-jwt.service';
import { ISession } from 'src/libs/ts/interfaces/session.interface';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class SessionsService implements ISessionsService {
  private readonly logger: Logger = new Logger(SessionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwt: InternalJwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async createSession({
    userId,
    deviceId,
    tokenPairId,
  }: ISession): Promise<void> {
    const userSessions: Session[] = await this.prisma.session.findMany({
      where: {
        userId,
      },
    });

    if (
      userSessions.length >=
      parseInt(this.configService.get('USER_SESSION_LIMIT'))
    ) {
      await this.deleteSession(userSessions[0].deviceId);

      this.logger.log(
        `Session limit reached, older session deleted for user ${userId}`,
      );
    }

    const sessionExpiredAt = this.getSessionExpirationDate();

    await this.prisma.session.create({
      data: {
        userId,
        deviceId,
        tokenPairId,
        expiredAt: sessionExpiredAt,
      },
    });

    this.logger.log(`New session created for user ${userId}`);
  }

  async updateSession(
    { deviceId, tokenPairId }: ISession,
    oldTokenPairId: string,
  ): Promise<void> {
    const sessionExpiredAt = this.getSessionExpirationDate();

    try {
      await this.prisma.session.update({
        where: {
          deviceId,
        },
        data: {
          tokenPairId,
          expiredAt: sessionExpiredAt,
        },
        select: {
          id: true,
        },
      });
    } catch (error: any) {
      this.logger.error(error.message);

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new UnauthorizedException(
          'auth.session.expired.or.invalid.refresh.token',
        );
      }
    }

    this.logger.log(`Session updated for device ${deviceId}`);

    await this.jwt.blacklistToken(oldTokenPairId.toString());
  }

  async deleteSession(deviceId: string): Promise<void> {
    const session = await this.prisma.session.delete({
      where: {
        deviceId,
      },
      select: {
        tokenPairId: true,
      },
    });

    if (session.tokenPairId) {
      await this.jwt.blacklistToken(session.tokenPairId);
    }
  }

  async deleteAllSessions(sessions: Session[]): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        userId: sessions[0]?.userId,
      },
    });

    await this.blackListAllSessionsTokens(sessions);
  }

  async blackListAllSessionsTokens(sessions: Session[]): Promise<void> {
    sessions.forEach((session) => {
      this.jwt.blacklistToken(session.tokenPairId);
    });
  }

  private getSessionExpirationDate = (): Date =>
    new Date(
      new Date().getTime() +
        this.configService.get('REFRESH_TOKEN_LIFE_TIME') * 1000,
    );
}
