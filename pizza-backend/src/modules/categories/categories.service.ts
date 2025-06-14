import { Injectable } from '@nestjs/common';
import { ICategoriesService } from './categories';
import { PrismaService } from 'src/libs/services/prisma.service';
import { CreateCategoryDto } from 'src/modules/categories/dtos/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/categories/dtos/update-category.dto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService implements ICategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto): Promise<void> {
    await this.prisma.category.create({
      data: {
        ...dto,
      },
    });
  }

  async findAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async findCategoryById(id: number): Promise<Category> {
    return this.prisma.category.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async updateCategory(id: number, dto: UpdateCategoryDto): Promise<void> {
    await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteCategory(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
