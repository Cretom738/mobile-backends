import { Injectable } from '@nestjs/common';
import { IQuestionService } from './questions';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { PrismaService } from 'src/libs/services/prisma.service';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService implements IQuestionService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuestion(quizId: number, dto: CreateQuestionDto): Promise<void> {
    const { answers, ...data } = dto;

    await this.prisma.question.create({
      data: {
        ...data,
        quizId,
        answers: {
          createMany: {
            data: answers,
          },
        },
      },
    });
  }

  async updateQuestion(id: number, dto: UpdateQuestionDto): Promise<void> {
    const { answers, ...data } = dto;

    const query: Prisma.QuestionUpdateArgs = answers
      ? {
          where: {
            id,
          },
          data: {
            ...data,
            answers: {
              deleteMany: {},
              createMany: {
                data: answers,
              },
            },
          },
        }
      : {
          where: {
            id,
          },
          data: {
            ...data,
          },
        };

    await this.prisma.question.update(query);
  }

  async deleteQuestion(id: number): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id,
      },
    });
  }
}
