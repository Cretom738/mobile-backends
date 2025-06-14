import { ConflictException, Injectable } from '@nestjs/common';
import { IQuizzesService } from './quizzes';
import { EQuizStatus, Prisma, Quiz, Result } from '@prisma/client';
import { UpdateQuizDto } from './dtos/update-quiz.dto';
import { PrismaService } from 'src/libs/services/prisma.service';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { FilterQuizDto } from './dtos/filter-quiz.dto';
import { QuizWithRelatedTables } from 'src/libs/ts/types/type';
import { addMinutes } from 'src/libs/helpers/helper';
import { SubmitAnswersDto } from './dtos/submit-anwsers.dto';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';
import { PaginatedRequestDto } from 'src/libs/dtos/paginated-request.dto';

@Injectable()
export class QuizzesService implements IQuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuiz(dto: CreateQuizDto): Promise<void> {
    await this.prisma.quiz.create({
      data: {
        ...dto,
      },
    });
  }

  async startQuiz(quizId: number, { userId }: IJwtPayload): Promise<void> {
    const isQuizStarted = !!(await this.prisma.result.count({
      where: {
        userId,
        status: EQuizStatus.STARTED,
      },
    }));

    if (isQuizStarted) {
      throw new ConflictException('quizzes.user_has_an_ongoing_quiz');
    }

    await this.prisma.result.create({
      data: {
        quizId,
        userId,
      },
    });
  }

  async submitAnswers(
    quizId: number,
    { answers }: SubmitAnswersDto,
    { userId }: IJwtPayload,
  ): Promise<void> {
    const quiz = await this.findStartedQuiz(quizId, userId);

    const result = quiz.results[0];

    await this.canSubmitAnswers(result, quiz.duration);

    const score = quiz.questions
      .flatMap((q) => q.answers)
      .filter((a) => answers.some((sa) => sa.answerId === a.id))
      .reduce((sum, a) => sum + a.score, 0);

    const totalScore = quiz.questions.reduce(
      (sum, q) => sum + Math.max(...q.answers.map((a) => a.score)),
      0,
    );

    await this.prisma.result.update({
      where: {
        id: result.id,
        status: EQuizStatus.STARTED,
      },
      data: {
        score,
        totalScore,
        status: EQuizStatus.ENDED,
      },
    });
  }

  async findQuizzes({
    title,
    limit,
    offset,
    sortOrder,
  }: FilterQuizDto): Promise<[Quiz[], number]> {
    const query: Prisma.QuizFindManyArgs = {
      where: {
        title: {
          contains: title,
        },
      },
    };

    return this.prisma.$transaction([
      this.prisma.quiz.findMany({
        where: query.where,
        skip: offset,
        take: limit,
        orderBy: {
          id: sortOrder,
        },
      }),
      this.prisma.quiz.count({
        where: query.where,
      }),
    ]);
  }

  async findResults(
    quizId: number,
    { limit, offset, sortOrder }: PaginatedRequestDto,
    { userId }: IJwtPayload,
  ): Promise<[Result[], number]> {
    const query: Prisma.ResultFindManyArgs = {
      where: {
        quizId,
        userId,
      },
    };

    return this.prisma.$transaction([
      this.prisma.result.findMany({
        where: query.where,
        skip: offset,
        take: limit,
        orderBy: {
          id: sortOrder,
        },
      }),
      this.prisma.result.count({
        where: query.where,
      }),
    ]);
  }

  async findAllQuizResults(
    quizId: number,
    { limit, offset, sortOrder }: PaginatedRequestDto,
  ): Promise<[Result[], number]> {
    const query: Prisma.ResultFindManyArgs = {
      where: {
        quizId,
      },
    };

    return this.prisma.$transaction([
      this.prisma.result.findMany({
        where: query.where,
        skip: offset,
        take: limit,
        orderBy: {
          id: sortOrder,
        },
      }),
      this.prisma.result.count({
        where: query.where,
      }),
    ]);
  }

  async findQuizById(
    id: number,
    { userId }: IJwtPayload,
  ): Promise<QuizWithRelatedTables> {
    return this.prisma.quiz.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
        results: {
          where: {
            userId,
          },
        },
      },
    });
  }

  async updateQuiz(id: number, dto: UpdateQuizDto): Promise<void> {
    await this.prisma.quiz.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteQuiz(id: number): Promise<void> {
    await this.prisma.quiz.delete({
      where: {
        id,
      },
    });
  }

  private async findStartedQuiz(
    id: number,
    userId: number,
  ): Promise<QuizWithRelatedTables> {
    return this.prisma.quiz.findUniqueOrThrow({
      where: {
        id,
        results: {
          some: {
            status: EQuizStatus.STARTED,
            userId,
          },
        },
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
        results: {
          where: {
            status: EQuizStatus.STARTED,
          },
        },
      },
    });
  }

  private async canSubmitAnswers(
    result: Result,
    duration: number,
  ): Promise<void> {
    const currentDate = new Date();

    const endDateWithTolerance = addMinutes(result.createdAt, duration + 2);

    if (currentDate > endDateWithTolerance) {
      await this.prisma.result.update({
        where: {
          id: result.id,
        },
        data: {
          status: EQuizStatus.FAILED,
        },
      });

      throw new ConflictException('quizzes.expired');
    }
  }
}
