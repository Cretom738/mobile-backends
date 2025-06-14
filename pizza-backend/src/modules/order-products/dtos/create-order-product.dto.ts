import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsInt, IsPositive } from 'class-validator';

export class CreateOrderProductDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ type: 'number', isArray: true })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  ingredientIds: number[];
}
