import { Ingredient } from '@prisma/client';
import { CreateIngredientDto } from 'src/modules/ingredients/dtos/create-ingredient.dto';
import { UpdateIngredientDto } from 'src/modules/ingredients/dtos/update-ingredient.dto';

export interface IIngredientsService {
  createIngredient(productId: number, dto: CreateIngredientDto): Promise<void>;

  findIngredientsByProductId(productId: number): Promise<Ingredient[]>;

  findIngredientById(ingredientId: number): Promise<Ingredient>;

  updateIngredient(
    productId: number,
    ingredientId: number,
    dto: UpdateIngredientDto,
  ): Promise<void>;

  deleteIngredient(ingredientId: number): Promise<void>;
}
