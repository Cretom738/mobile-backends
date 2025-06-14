import { ApiProperty } from '@nestjs/swagger';
import { Quiz } from '@prisma/client';
import { CreateQuizDto } from './create-quiz.dto';

export class QuizzesDto extends CreateQuizDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly createdAt: Date;

  constructor(quiz: Quiz) {
    super();
    this.id = quiz.id;
    this.title = quiz.title;
    this.duration = quiz.duration;
    this.description = quiz.description;
    this.specialityId = quiz.specialityId;
    this.createdAt = quiz.createdAt;
  }
}
