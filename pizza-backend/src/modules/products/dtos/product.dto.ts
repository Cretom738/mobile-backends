import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { Product } from '@prisma/client';

export class ProductDto extends CreateProductDto {
  @ApiProperty()
  readonly id: number;

  constructor(product: Product) {
    super();
    this.id = product.id;
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.imageUrl = product.imageUrl;
    this.categoryId = product.categoryId;
  }
}
