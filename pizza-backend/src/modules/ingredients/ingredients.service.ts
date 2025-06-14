import { Injectable } from '@nestjs/common';
import { CreateIngredientDto } from 'src/modules/ingredients/dtos/create-ingredient.dto';
import { PrismaService } from 'src/libs/services/prisma.service';
import { IIngredientsService } from './ingredients';
import { UpdateIngredientDto } from 'src/modules/ingredients/dtos/update-ingredient.dto';
import { Ingredient } from '@prisma/client';

@Injectable()
export class IngredientsService implements IIngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async createIngredient(
    productId: number,
    dto: CreateIngredientDto,
  ): Promise<void> {
    await this.prisma.ingredient.create({
      data: {
        productId,
        ...dto,
      },
    });
  }

  async findIngredientsByProductId(productId: number): Promise<Ingredient[]> {
    return this.prisma.ingredient.findMany({
      where: {
        productId,
      },
    });
  }

  async findIngredientById(ingredientId: number): Promise<Ingredient> {
    return this.prisma.ingredient.findUniqueOrThrow({
      where: {
        id: ingredientId,
      },
    });
  }

  async updateIngredient(
    productId: number,
    ingredientId: number,
    dto: UpdateIngredientDto,
  ): Promise<void> {
    await this.prisma.ingredient.update({
      where: {
        id: ingredientId,
      },
      data: {
        productId,
        ...dto,
      },
    });
  }

  async deleteIngredient(ingredientId: number): Promise<void> {
    await this.prisma.ingredient.delete({
      where: {
        id: ingredientId,
      },
    });
  }
}
