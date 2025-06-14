import { ERole } from '.prisma/client';
import { EJwtTokenTypes } from '../enums/enum';

export interface IJwtPayload {
  deviceId: string;

  userId: number;

  tokenPairId: string;

  role: ERole;

  type: EJwtTokenTypes;
}
