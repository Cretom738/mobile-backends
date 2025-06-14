import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';

export interface IQuestionService {
  createQuestion(quizId: number, dto: CreateQuestionDto): Promise<void>;

  updateQuestion(id: number, dto: UpdateQuestionDto): Promise<void>;

  deleteQuestion(id: number): Promise<void>;
}
