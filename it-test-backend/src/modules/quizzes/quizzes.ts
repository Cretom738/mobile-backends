import { Quiz, Result } from '@prisma/client';
import { UpdateQuizDto } from './dtos/update-quiz.dto';
import { CreateQuizDto } from './dtos/create-quiz.dto';
import { FilterQuizDto } from './dtos/filter-quiz.dto';
import { QuizWithRelatedTables } from 'src/libs/ts/types/type';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';
import { SubmitAnswersDto } from './dtos/submit-anwsers.dto';
import { PaginatedRequestDto } from 'src/libs/dtos/paginated-request.dto';

export interface IQuizzesService {
  createQuiz(dto: CreateQuizDto, user: IJwtPayload): Promise<void>;

  startQuiz(quizId: number, user: IJwtPayload): Promise<void>;

  submitAnswers(
    quizId: number,
    dto: SubmitAnswersDto,
    user: IJwtPayload,
  ): Promise<void>;

  findQuizzes(filterData: FilterQuizDto): Promise<[Quiz[], number]>;

  findResults(
    quizId: number,
    filterData: PaginatedRequestDto,
    user: IJwtPayload,
  ): Promise<[Result[], number]>;

  findAllQuizResults(
    quizId: number,
    filterData: PaginatedRequestDto,
  ): Promise<[Result[], number]>;

  findQuizById(id: number, user: IJwtPayload): Promise<QuizWithRelatedTables>;

  updateQuiz(id: number, dto: UpdateQuizDto, user: IJwtPayload): Promise<void>;

  deleteQuiz(id: number, user: IJwtPayload): Promise<void>;
}
