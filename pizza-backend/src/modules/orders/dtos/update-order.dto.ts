import { ApiPropertyOptional } from '@nestjs/swagger';
import { EOrderStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @ApiPropertyOptional({ enum: EOrderStatus })
  @IsEnum(EOrderStatus)
  @IsOptional()
  status: EOrderStatus;
}
