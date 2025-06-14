import { ApiProperty } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { Category } from '@prisma/client';

export class CategoryDto extends CreateCategoryDto {
  @ApiProperty()
  readonly id: number;

  constructor(category: Category) {
    super();
    this.title = category.title;
    this.id = category.id;
  }
}
