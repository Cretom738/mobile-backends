import { ApiProperty } from '@nestjs/swagger';

export class BaseErrorResponseDto {
  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}
