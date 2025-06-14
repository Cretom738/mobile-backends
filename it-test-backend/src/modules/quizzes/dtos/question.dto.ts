import { ApiProperty, OmitType } from '@nestjs/swagger';
import { QuestionsWithRelatedTables } from 'src/libs/ts/types/type';
import { CreateQuestionDto } from 'src/modules/questions/dtos/create-question.dto';
import { AnswerDto } from './answer.dto';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';

export class QuestionDto extends OmitType(CreateQuestionDto, ['answers']) {
  @ApiProperty()
  readonly id: number;

  @ApiProperty({ type: [AnswerDto] })
  readonly answers: AnswerDto[];

  constructor(question: QuestionsWithRelatedTables, user: IJwtPayload) {
    super();
    this.id = question.id;
    this.text = question.text;
    this.imageUrl = question.imageUrl || null;
    this.answers = question.answers.map((a) => new AnswerDto(a, user));
  }
}
