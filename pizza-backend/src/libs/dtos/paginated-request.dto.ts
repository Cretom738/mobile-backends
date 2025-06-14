import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ESortOrder } from '../ts/enums/enum';

export class PaginatedRequestDto {
  @ApiPropertyOptional({
    default: 10,
    minimum: 0,
    maximum: 30,
    type: 'number',
  })
  @IsInt()
  @Min(0)
  @Max(30)
  @IsOptional()
  @Type(() => Number)
  limit = 10;

  @ApiPropertyOptional({
    default: 0,
    minimum: 0,
    type: 'number',
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  offset = 0;

  @ApiPropertyOptional({ enum: ESortOrder })
  @IsEnum(ESortOrder)
  @IsOptional()
  sortOrder = ESortOrder.DESC;
}
