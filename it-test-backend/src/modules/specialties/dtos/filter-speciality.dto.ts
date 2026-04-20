import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginatedRequestDto } from '../../../libs/dtos/paginated-request.dto';

export class FilterSpecialityDto extends PaginatedRequestDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;
}
