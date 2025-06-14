import { ERole } from '@prisma/client';

export interface IUserData {
  userId: number;
  role?: ERole;
}

export interface ITokenPairs {
  accessToken: string;
  refreshToken: string;
}
