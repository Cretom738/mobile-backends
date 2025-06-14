import { CreateOrderDto } from './dtos/create-order.dto';
import { FilterOrderDto } from './dtos/filter-order.dto';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';
import { OrderWithRelatedTables, OrderWithUser } from 'src/libs/ts/types/type';
import { UpdateOrderDto } from './dtos/update-order.dto';

export interface IOrdersService {
  createOrder(dto: CreateOrderDto, user: IJwtPayload): Promise<void>;

  findOrders(
    filterData: FilterOrderDto,
    user: IJwtPayload,
  ): Promise<[OrderWithUser[], number]>;

  findOrderById(id: number, user: IJwtPayload): Promise<OrderWithRelatedTables>;

  updateOrder(id: number, dto: UpdateOrderDto): Promise<void>;

  deleteOrder(id: number): Promise<void>;
}
