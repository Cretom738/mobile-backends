import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ArgonService } from '../../libs/services/argon.service';
import { InternalJwtService } from '../internal-jwt/internal-jwt.service';
import { PrismaService } from '../../libs/services/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../../libs/config/jwt.config';
import { SessionsService } from '../../modules/sessions/sessions.service';

@Module({
  imports: [JwtModule.registerAsync(getJwtConfig())],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    ArgonService,
    InternalJwtService,
    PrismaService,
    SessionsService,
  ],
})
export class AuthModule {}
