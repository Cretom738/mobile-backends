import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/libs/services/prisma.service';
import { SessionsModule } from '../sessions/sessions.module';
import { ArgonService } from 'src/libs/services/argon.service';

@Module({
  imports: [SessionsModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, ArgonService],
})
export class UsersModule {}
