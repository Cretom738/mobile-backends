import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IngredientDto } from 'src/modules/ingredients/dtos/ingredient.dto';
import { CreateIngredientDto } from 'src/modules/ingredients/dtos/create-ingredient.dto';
import { UpdateIngredientDto } from 'src/modules/ingredients/dtos/update-ingredient.dto';
import { Ingredient, ERole } from '@prisma/client';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { RoleGuard } from 'src/libs/guards/role.guard';
import { Roles } from 'src/libs/decorators/role.decorator';

@Controller('products/:productId/ingredients')
@ApiTags('Ingredients')
export class IngredientsController {
  constructor(private readonly service: IngredientsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать ингредиент' })
  @ApiCreatedResponse({
    description: 'Ресурс создан',
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации',
    type: BadErrorRequestDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Нет доступа',
    type: CommonErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  @Roles(ERole.ADMIN)
  @UseGuards(RoleGuard)
  async createIngredient(
    @Param('productId') productId: string,
    @Body() dto: CreateIngredientDto,
  ): Promise<void> {
    await this.service.createIngredient(+productId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список ингредиентов по id продукта' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: IngredientDto,
    isArray: true,
  })
  async findIngredientsByProductId(
    @Param('productId') productId: string,
  ): Promise<IngredientDto[]> {
    const ingredients: Ingredient[] =
      await this.service.findIngredientsByProductId(+productId);

    return ingredients.map((c) => new IngredientDto(c));
  }

  @Get(':ingredientId')
  @ApiOperation({ summary: 'Получить ингредиент по id' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: IngredientDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  async findIngredientById(
    @Param('ingredientId') ingredientId: string,
  ): Promise<IngredientDto> {
    const ingredient: Ingredient =
      await this.service.findIngredientById(+ingredientId);

    return new IngredientDto(ingredient);
  }

  @Patch(':ingredientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить ингредиент по id' })
  @ApiNoContentResponse({
    description: 'Выполнено успешно',
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации',
    type: BadErrorRequestDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Нет доступа',
    type: CommonErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  @Roles(ERole.ADMIN)
  @UseGuards(RoleGuard)
  async updateIngredient(
    @Param('productId') productId: string,
    @Param('ingredientId') ingredientId: string,
    @Body() dto: UpdateIngredientDto,
  ): Promise<void> {
    await this.service.updateIngredient(+productId, +ingredientId, dto);
  }

  @Delete(':ingredientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить ингредиент по id' })
  @ApiNoContentResponse({
    description: 'Выполнено успешно',
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Нет доступа',
    type: CommonErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  @Roles(ERole.ADMIN)
  @UseGuards(RoleGuard)
  async deleteIngredient(
    @Param('productId') _: string,
    @Param('ingredientId') ingredientId: string,
  ): Promise<void> {
    await this.service.deleteIngredient(+ingredientId);
  }
}
