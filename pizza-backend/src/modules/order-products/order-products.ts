import { CreateOrderProductDto } from './dtos/create-order-product.dto';
import { UpdateOrderProductDto } from './dtos/update-order-product.dto';

export interface IOrderProductService {
  createOrderProduct(
    orderId: number,
    dto: CreateOrderProductDto,
  ): Promise<void>;

  updateOrderProduct(id: number, dto: UpdateOrderProductDto): Promise<void>;

  deleteOrderProduct(id: number): Promise<void>;
}
