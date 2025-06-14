import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IAuthService } from './auth';
import { AuthDto } from 'src/modules/auth/dtos/auth.dto';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { AuthSuccessDto } from 'src/modules/auth/dtos/auth-success.dto';
import { UsersService } from '../users/users.service';
import { ArgonService } from 'src/libs/services/argon.service';
import { InternalJwtService } from '../internal-jwt/internal-jwt.service';
import { randomUUID } from 'crypto';
import { SessionsService } from 'src/modules/sessions/sessions.service';
import { EJwtTokenTypes } from 'src/libs/ts/enums/enum';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly argon: ArgonService,
    private readonly jwt: InternalJwtService,
    private readonly sessionsService: SessionsService,
  ) {}

  async register({
    email,
    fullName,
    password,
  }: CreateUserDto): Promise<AuthSuccessDto> {
    const { id, role } = await this.usersService.createUser({
      email,
      fullName,
      password,
    });

    const deviceId = randomUUID();

    const { accessToken, refreshToken, tokenPairId } =
      await this.jwt.generateTokenPairs(id, role, deviceId);

    await this.sessionsService.createSession({
      userId: id,
      deviceId,
      tokenPairId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login({ email, password }: AuthDto): Promise<AuthSuccessDto> {
    const { id, role, hashedPassword } =
      await this.usersService.findUserByEmail(email);

    const isPasswordValid = await this.argon.compare(password, hashedPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('auth.invalid.credentials');
    }

    const deviceId = randomUUID();

    const { accessToken, refreshToken, tokenPairId } =
      await this.jwt.generateTokenPairs(id, role, deviceId);

    await this.sessionsService.createSession({
      userId: id,
      deviceId,
      tokenPairId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(deviceId: string): Promise<void> {
    await this.sessionsService.deleteSession(deviceId);
  }

  async refresh(incomingRefreshToken: string): Promise<AuthSuccessDto> {
    const { isTokenValid, payload } = await this.jwt.verifyToken(
      incomingRefreshToken,
      EJwtTokenTypes.REFRESH_TOKEN,
    );

    if (!isTokenValid) {
      throw new UnauthorizedException('auth.session.expired.or.invalid.token');
    }

    const { refreshToken, accessToken, tokenPairId } =
      await this.jwt.generateTokenPairs(
        payload.userId,
        payload.role,
        payload.deviceId,
      );

    await this.sessionsService.updateSession(
      {
        userId: payload.userId,
        deviceId: payload.deviceId,
        tokenPairId,
      },
      payload.tokenPairId,
    );

    return {
      refreshToken,
      accessToken,
    };
  }
}
