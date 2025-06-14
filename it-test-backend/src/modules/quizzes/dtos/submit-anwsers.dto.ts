import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';

class SubmitAnswerDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  questionId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  answerId: number;
}

export class SubmitAnswersDto {
  @ApiProperty({ type: [SubmitAnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers: SubmitAnswerDto[];
}
