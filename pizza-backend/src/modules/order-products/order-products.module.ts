import { Module } from '@nestjs/common';
import { PrismaService } from 'src/libs/services/prisma.service';
import { OrderProductsController } from './order-products.controller';
import { OrderProductsService } from './order-products.service';

@Module({
  controllers: [OrderProductsController],
  providers: [PrismaService, OrderProductsService],
})
export class OrderProductsModule {}
