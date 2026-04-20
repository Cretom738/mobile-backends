import { Ingredient } from '@prisma/client';
import { CreateIngredientDto } from '../../modules/ingredients/dtos/create-ingredient.dto';
import { UpdateIngredientDto } from '../../modules/ingredients/dtos/update-ingredient.dto';

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
