import { Category } from '@prisma/client';
import { CreateCategoryDto } from 'src/modules/categories/dtos/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/categories/dtos/update-category.dto';

export interface ICategoriesService {
  createCategory(dto: CreateCategoryDto): Promise<void>;

  findAllCategories(): Promise<Category[]>;

  findCategoryById(id: number): Promise<Category>;

  updateCategory(id: number, dto: UpdateCategoryDto): Promise<void>;

  deleteCategory(id: number): Promise<void>;
}
