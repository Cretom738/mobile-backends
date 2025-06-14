import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { PrismaService } from 'src/libs/services/prisma.service';

@Module({
  controllers: [QuizzesController],
  providers: [PrismaService, QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
