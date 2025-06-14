import { ERole } from '@prisma/client';
import { EJwtTokenTypes } from 'src/libs/ts/enums/enum';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';

export interface IInternalJwtService {
  generateToken(payload: IJwtPayload, lifeTime: number): Promise<string>;

  generateTokenPairs(
    userId: number,
    role: ERole,
    deviceId: string,
  ): Promise<{
    refreshToken: string;
    accessToken: string;
    tokenPairId: string;
  }>;

  verifyToken(
    token: string,
    type: EJwtTokenTypes,
  ): Promise<{ isTokenValid: boolean; payload: IJwtPayload }>;

  blacklistToken(tokenPairId: string): Promise<void>;
}
