import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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
import { OrdersService } from './orders.service';
import { OrdersDto } from './dtos/orders.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { ERole } from '@prisma/client';
import { ApiOkPaginatedResponse } from 'src/libs/decorators/paginated-response.decorator';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { PaginatedResponseDto } from 'src/libs/dtos/paginated-response.dto';
import { RoleGuard } from 'src/libs/guards/role.guard';
import { Roles } from 'src/libs/decorators/role.decorator';
import { FilterOrderDto } from './dtos/filter-order.dto';
import { AuthGuard } from 'src/libs/guards/auth.guard';
import { OrderDto } from './dtos/order.dto';
import { UserInfo } from 'src/libs/decorators/user-info.decorator';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';
import { OrderWithRelatedTables } from 'src/libs/ts/types/type';

@Controller('orders')
@ApiTags('Orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать заказ' })
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
  async createOrder(
    @Body() dto: CreateOrderDto,
    @UserInfo() user: IJwtPayload,
  ): Promise<void> {
    await this.service.createOrder(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список заказов' })
  @ApiOkPaginatedResponse(OrderDto)
  @ApiBadRequestResponse({
    description: 'Ошибка валидации',
    type: BadErrorRequestDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  async findOrders(
    @Query() filterData: FilterOrderDto,
    @UserInfo() user: IJwtPayload,
  ): Promise<PaginatedResponseDto<OrdersDto>> {
    const [orders, count] = await this.service.findOrders(filterData, user);

    return new PaginatedResponseDto({
      result: orders.map((o) => new OrdersDto(o)),
      count,
      offset: filterData.offset,
      limit: filterData.limit,
      sortOrder: filterData.sortOrder,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заказ по id' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: OrderDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  async findOrderById(
    @Param('id') id: string,
    @UserInfo() user: IJwtPayload,
  ): Promise<OrderDto> {
    const order: OrderWithRelatedTables = await this.service.findOrderById(
      +id,
      user,
    );

    return new OrderDto(order);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить заказ по id' })
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
  @Roles(ERole.ADMIN, ERole.DELIVERY)
  @UseGuards(RoleGuard)
  async updateOrder(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ): Promise<void> {
    await this.service.updateOrder(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить заказ по id' })
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
  async deleteOrder(@Param('id') id: number): Promise<void> {
    await this.service.deleteOrder(+id);
  }
}
