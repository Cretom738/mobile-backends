import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { PrismaService } from 'src/libs/services/prisma.service';
import { Prisma, ERole } from '@prisma/client';
import { FilterOrderDto } from './dtos/filter-order.dto';
import { OrderWithRelatedTables, OrderWithUser } from 'src/libs/ts/types/type';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';
import { IOrdersService } from './orders';

@Injectable()
export class OrdersService implements IOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    dto: CreateOrderDto,
    { userId }: IJwtPayload,
  ): Promise<void> {
    await this.prisma.order.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findOrders(
    { status, cityId, offset, limit, sortOrder }: FilterOrderDto,
    { userId, role }: IJwtPayload,
  ): Promise<[OrderWithUser[], number]> {
    const query: Prisma.OrderFindManyArgs =
      role === ERole.USER
        ? {
            where: {
              status,
              cityId,
              userId,
            },
          }
        : {
            where: {
              status,
              cityId,
            },
          };

    return this.prisma.$transaction([
      this.prisma.order.findMany({
        where: query.where,
        skip: offset,
        take: limit,
        orderBy: {
          id: sortOrder,
        },
        include: {
          user: true,
        },
      }),
      this.prisma.order.count({
        where: query.where,
      }),
    ]);
  }

  async findOrderById(
    id: number,
    { userId, role }: IJwtPayload,
  ): Promise<OrderWithRelatedTables> {
    const query: Prisma.OrderFindUniqueOrThrowArgs =
      role === ERole.USER
        ? {
            where: {
              id,
              userId,
            },
          }
        : {
            where: {
              id,
            },
          };

    return this.prisma.order.findUniqueOrThrow({
      where: query.where,
      include: {
        orderProducts: {
          include: {
            orderProductIngredients: {
              include: {
                ingredient: true,
              },
            },
            product: true,
          },
        },
        user: true,
      },
    });
  }

  async updateOrder(id: number, dto: UpdateOrderDto): Promise<void> {
    await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteOrder(id: number): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id,
      },
    });
  }
}
