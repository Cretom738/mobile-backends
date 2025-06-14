import { ApiProperty } from '@nestjs/swagger';
import { EQuizStatus, Result } from '@prisma/client';

export class ResultDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly score: number;

  @ApiProperty()
  readonly totalScore: number;

  @ApiProperty({ enum: EQuizStatus })
  readonly status: EQuizStatus;

  @ApiProperty()
  readonly quizId: number;

  @ApiProperty()
  readonly userId: number;

  @ApiProperty()
  readonly createdAt: Date;

  constructor(result: Result) {
    this.id = result.id;
    this.score = result.score;
    this.totalScore = result.totalScore;
    this.status = result.status;
    this.quizId = result.quizId;
    this.userId = result.userId;
    this.createdAt = result.createdAt;
  }
}
