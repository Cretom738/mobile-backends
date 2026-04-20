import { ApiProperty } from '@nestjs/swagger';
import { Answer, ERole } from '@prisma/client';
import { IJwtPayload } from '../../../libs/ts/interfaces/jwt-payload.interface';
import { CreateAnswerDto } from '../../../modules/questions/dtos/create-answer.dto';

export class AnswerDto extends CreateAnswerDto {
  @ApiProperty()
  readonly id: number;

  constructor(answer: Answer, user: IJwtPayload) {
    super();
    this.id = answer.id;
    this.text = answer.text;
    if (user?.role !== ERole.USER) {
      this.score = answer.score;
    }
  }
}
