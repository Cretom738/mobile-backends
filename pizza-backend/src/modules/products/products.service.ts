import { Injectable } from '@nestjs/common';
import { IProductsService } from './products';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PrismaService } from 'src/libs/services/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { FilterProductDto } from './dtos/filter-product.dto';

@Injectable()
export class ProductsService implements IProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto): Promise<void> {
    await this.prisma.product.create({
      data: {
        ...dto,
      },
    });
  }

  async findProducts({
    title,
    offset,
    limit,
    sortOrder,
  }: FilterProductDto): Promise<[Product[], number]> {
    const query: Prisma.ProductFindManyArgs = {
      where: {
        title: {
          contains: title,
        },
      },
    };

    return this.prisma.$transaction([
      this.prisma.product.findMany({
        where: query.where,
        skip: offset,
        take: limit,
        orderBy: {
          id: sortOrder,
        },
      }),
      this.prisma.product.count({
        where: query.where,
      }),
    ]);
  }

  async findProductById(id: number): Promise<Product> {
    return this.prisma.product.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async updateProduct(id: number, dto: UpdateProductDto): Promise<void> {
    await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
