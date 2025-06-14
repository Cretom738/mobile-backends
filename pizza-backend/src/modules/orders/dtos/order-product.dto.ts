import { ApiProperty } from '@nestjs/swagger';
import { OrderProductWithRelatedTables } from 'src/libs/ts/types/type';
import { IngredientDto } from 'src/modules/ingredients/dtos/ingredient.dto';
import { ProductDto } from 'src/modules/products/dtos/product.dto';

export class OrderProductDto extends ProductDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly amount: number;

  @ApiProperty({ type: [IngredientDto] })
  readonly ingredients: IngredientDto[];

  constructor(orderProduct: OrderProductWithRelatedTables) {
    super(orderProduct.product);
    this.id = orderProduct.id;
    this.amount = orderProduct.amount;
    this.ingredients = orderProduct.orderProductIngredients.map(
      (opi) => new IngredientDto(opi.ingredient),
    );
  }
}
