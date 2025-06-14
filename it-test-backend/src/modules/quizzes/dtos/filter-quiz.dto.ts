import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginatedRequestDto } from 'src/libs/dtos/paginated-request.dto';

export class FilterQuizDto extends PaginatedRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;
}
