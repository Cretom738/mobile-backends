import { ApiProperty } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { EOrderStatus } from '@prisma/client';
import { OrderWithUser } from 'src/libs/ts/types/type';

export class OrdersDto extends CreateOrderDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty({ enum: EOrderStatus })
  readonly status: EOrderStatus;

  @ApiProperty()
  readonly fullName: string;

  @ApiProperty()
  readonly createdAt: Date;

  constructor(order: OrderWithUser) {
    super();
    this.id = order.id;
    this.description = order.description;
    this.phone = order.phone;
    this.address = order.address;
    this.status = order.status;
    this.cityId = order.cityId;
    this.fullName = order.user.fullName;
    this.createdAt = order.createdAt;
  }
}
