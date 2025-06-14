import { ApiProperty } from '@nestjs/swagger';
import { EQuizStatus, ERole } from '@prisma/client';
import { QuizWithRelatedTables } from 'src/libs/ts/types/type';
import { QuestionDto } from './question.dto';
import { QuizzesDto } from './quizzes.dto';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';

export class QuizDto extends QuizzesDto {
  @ApiProperty({ type: [QuestionDto] })
  readonly questions: QuestionDto[];

  constructor(quiz: QuizWithRelatedTables, user: IJwtPayload) {
    super(quiz);
    const isStartedQuiz = quiz.results.some(
      (r) => r.status === EQuizStatus.STARTED,
    );
    if (user.role !== ERole.USER || isStartedQuiz) {
      this.questions = quiz.questions.map((q) => new QuestionDto(q, user));
    }
  }
}
