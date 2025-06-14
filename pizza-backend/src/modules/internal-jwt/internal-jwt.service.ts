import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { Redis } from 'ioredis';
import { EJwtTokenTypes } from 'src/libs/ts/enums/enum';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';
import { IInternalJwtService } from './internal-jwt';
import { ERole } from '@prisma/client';

@Injectable()
export class InternalJwtService implements IInternalJwtService {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async generateToken(payload: IJwtPayload, lifeTime: number): Promise<string> {
    return this.jwt.signAsync(payload, {
      expiresIn: lifeTime,
    });
  }

  async generateTokenPairs(
    userId: number,
    role: ERole,
    deviceId: string,
  ): Promise<{
    refreshToken: string;
    accessToken: string;
    tokenPairId: string;
  }> {
    const tokenPairId = randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(
        {
          userId,
          role,
          deviceId,
          tokenPairId,
          type: EJwtTokenTypes.ACCESS_TOKEN,
        },
        this.configService.get('ACCESS_TOKEN_LIFE_TIME'),
      ),
      this.generateToken(
        {
          userId,
          role,
          deviceId,
          tokenPairId,
          type: EJwtTokenTypes.REFRESH_TOKEN,
        },
        this.configService.get('REFRESH_TOKEN_LIFE_TIME'),
      ),
    ]);

    return {
      refreshToken,
      accessToken,
      tokenPairId,
    };
  }

  async verifyToken(
    token: string,
    type: EJwtTokenTypes,
  ): Promise<{ isTokenValid: boolean; payload: IJwtPayload }> {
    const payload: IJwtPayload = await this.jwt.verifyAsync<IJwtPayload>(
      token,
      { ignoreExpiration: false },
    );

    if (!payload || payload.type !== type) {
      return {
        isTokenValid: false,
        payload: null,
      };
    }

    return {
      isTokenValid: !(await this.isTokenBlacklisted(payload.tokenPairId)),
      payload,
    };
  }

  async blacklistToken(tokenPairId: string): Promise<void> {
    await this.redis.set(
      this.getBlackListTokenKey(tokenPairId),
      tokenPairId,
      'EX',
      this.configService.get('REFRESH_TOKEN_LIFE_TIME'),
    );
  }

  private async isTokenBlacklisted(tokenPairId: string): Promise<boolean> {
    return !!(await this.redis.exists(
      this.getBlackListTokenKey(tokenPairId.toString()),
    ));
  }

  private getBlackListTokenKey = (tokenPairId: string): string =>
    `token-pair-id-${tokenPairId}`;
}
