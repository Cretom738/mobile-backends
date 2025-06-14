import { ApiProperty } from '@nestjs/swagger';
import { OrdersDto } from './orders.dto';
import { OrderWithRelatedTables } from 'src/libs/ts/types/type';
import { OrderProductDto } from './order-product.dto';

export class OrderDto extends OrdersDto {
  @ApiProperty()
  readonly totalPrice: number;

  @ApiProperty({ type: [OrderProductDto] })
  readonly orderProduct: OrderProductDto[];

  constructor(order: OrderWithRelatedTables) {
    super(order);
    this.totalPrice = order.orderProducts.reduce(
      (sum, op) =>
        sum +
        op.amount *
          (op.product.price +
            op.orderProductIngredients.reduce(
              (sum, opi) => sum + opi.ingredient.price,
              0,
            )),
      0,
    );
    this.orderProduct = order.orderProducts.map(
      (op) => new OrderProductDto(op),
    );
  }
}
