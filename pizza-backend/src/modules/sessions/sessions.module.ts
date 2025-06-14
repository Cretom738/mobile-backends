import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { PrismaService } from 'src/libs/services/prisma.service';
import { InternalJwtModule } from '../internal-jwt/internal-jwt.module';

@Module({
  imports: [InternalJwtModule],
  providers: [SessionsService, PrismaService],
  exports: [SessionsService],
})
export class SessionsModule {}
