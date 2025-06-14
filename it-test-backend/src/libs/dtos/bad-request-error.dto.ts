import { ApiProperty } from '@nestjs/swagger';
import { BaseErrorResponseDto } from './base-error-response.dto';

export class BadErrorRequestDto extends BaseErrorResponseDto {
  @ApiProperty()
  message: string[];
}
