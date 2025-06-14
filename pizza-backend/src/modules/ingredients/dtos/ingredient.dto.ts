import { ApiProperty } from '@nestjs/swagger';
import { CreateIngredientDto } from './create-ingredient.dto';
import { Ingredient } from '@prisma/client';

export class IngredientDto extends CreateIngredientDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly productId: number;

  constructor(ingredient: Ingredient) {
    super();
    this.id = ingredient.id;
    this.title = ingredient.title;
    this.price = ingredient.price;
    this.imageUrl = ingredient.imageUrl;
    this.productId = ingredient.productId;
  }
}
