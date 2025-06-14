import { BaseErrorResponseDto } from './base-error-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CommonErrorResponseDto extends BaseErrorResponseDto {
  @ApiProperty()
  message: string;
}
