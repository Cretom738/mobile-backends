import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
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
import { CategoriesService } from './categories.service';
import { CategoryDto } from 'src/modules/categories/dtos/category.dto';
import { Category, ERole } from '@prisma/client';
import { CreateCategoryDto } from 'src/modules/categories/dtos/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/categories/dtos/update-category.dto';
import { Patch } from '@nestjs/common';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { Roles } from 'src/libs/decorators/role.decorator';
import { RoleGuard } from 'src/libs/guards/role.guard';

@Controller('categories')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать категорию' })
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
  @Roles(ERole.ADMIN)
  @UseGuards(RoleGuard)
  async createCategory(@Body() dto: CreateCategoryDto): Promise<void> {
    await this.service.createCategory(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список категорий' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: CategoryDto,
    isArray: true,
  })
  async findAllCategories(): Promise<CategoryDto[]> {
    const categories: Category[] = await this.service.findAllCategories();

    return categories.map((c) => new CategoryDto(c));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить категорию по id' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: CategoryDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  async findCategoryById(@Param('id') id: string): Promise<CategoryDto> {
    const category: Category = await this.service.findCategoryById(+id);

    return new CategoryDto(category);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить категорию по id' })
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
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<void> {
    await this.service.updateCategory(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить категорию по id' })
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
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.service.deleteCategory(+id);
  }
}
