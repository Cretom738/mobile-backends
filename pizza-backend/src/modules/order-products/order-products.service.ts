import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/libs/services/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateOrderProductDto } from './dtos/create-order-product.dto';
import { IOrderProductService } from './order-products';
import { UpdateOrderProductDto } from './dtos/update-order-product.dto';

@Injectable()
export class OrderProductsService implements IOrderProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrderProduct(
    orderId: number,
    dto: CreateOrderProductDto,
  ): Promise<void> {
    const { ingredientIds, ...data } = dto;

    await this.checkProductIngredients(data.productId, ingredientIds);

    await this.prisma.orderProduct.create({
      data: {
        ...data,
        orderId,
        orderProductIngredients: {
          createMany: {
            data: ingredientIds.map((ingredientId) => ({
              ingredientId,
            })),
          },
        },
      },
    });
  }

  async updateOrderProduct(
    id: number,
    dto: UpdateOrderProductDto,
  ): Promise<void> {
    const { ingredientIds, ...data } = dto;

    const orderProductId =
      data.productId ??
      (
        await this.prisma.orderProduct.findUniqueOrThrow({
          where: {
            id,
          },
          select: {
            productId: true,
          },
        })
      ).productId;

    await this.checkProductIngredients(orderProductId, ingredientIds);

    const query: Prisma.OrderProductUpdateArgs = ingredientIds
      ? {
          where: {
            id,
          },
          data: {
            ...data,
            orderProductIngredients: {
              deleteMany: {},
              createMany: {
                data: ingredientIds.map((ingredientId) => ({
                  ingredientId,
                })),
              },
            },
          },
        }
      : {
          where: {
            id,
          },
          data: {
            ...data,
          },
        };

    await this.prisma.orderProduct.update(query);
  }

  async deleteOrderProduct(id: number): Promise<void> {
    await this.prisma.orderProduct.delete({
      where: {
        id,
      },
    });
  }

  async checkProductIngredients(
    productId: number,
    ingredientIds: number[],
  ): Promise<void> {
    if (!ingredientIds) return;

    const productIngredients = await this.prisma.ingredient.findMany({
      where: {
        productId,
      },
      select: {
        id: true,
      },
    });

    const productIngredientsIds = productIngredients.map((i) => i.id);

    if (!ingredientIds.every((id) => productIngredientsIds.includes(id))) {
      throw new NotFoundException(
        'order_products_no.such.ingredient.for.product',
      );
    }
  }
}
