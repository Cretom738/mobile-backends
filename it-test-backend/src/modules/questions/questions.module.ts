import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { PrismaService } from 'src/libs/services/prisma.service';

@Module({
  controllers: [QuestionsController],
  providers: [PrismaService, QuestionsService],
})
export class QuestionsModule {}
