import { ApiPropertyOptional } from '@nestjs/swagger';
import { EOrderStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { PaginatedRequestDto } from 'src/libs/dtos/paginated-request.dto';

export class FilterOrderDto extends PaginatedRequestDto {
  @ApiPropertyOptional({ enum: EOrderStatus })
  @IsEnum(EOrderStatus)
  @IsOptional()
  status: EOrderStatus;

  @ApiPropertyOptional()
  @IsInt()
  @IsPositive()
  @IsOptional()
  cityId: number;
}
