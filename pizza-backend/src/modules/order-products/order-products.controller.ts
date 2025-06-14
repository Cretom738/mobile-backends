import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleGuard } from 'src/libs/guards/role.guard';
import { Roles } from 'src/libs/decorators/role.decorator';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { ERole } from '@prisma/client';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';
import { OrderProductsService } from './order-products.service';
import { CreateOrderProductDto } from './dtos/create-order-product.dto';
import { UpdateOrderProductDto } from './dtos/update-order-product.dto';

@ApiTags('OrderProducts')
@Controller('orders/:id/order-products')
@UseGuards(RoleGuard)
export class OrderProductsController {
  constructor(private readonly service: OrderProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать заказанный продукт' })
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
  @ApiForbiddenResponse({
    description: 'Нет доступа',
    type: CommonErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Конфликт с состоянием сервера',
    type: CommonErrorResponseDto,
  })
  @Roles(ERole.ADMIN)
  async createOrderProduct(
    @Param('id') id: string,
    @Body() dto: CreateOrderProductDto,
  ): Promise<void> {
    await this.service.createOrderProduct(+id, dto);
  }

  @Patch(':orderProductId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить заказанный продукт по id' })
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
  @ApiConflictResponse({
    description: 'Конфликт с состоянием сервера',
    type: CommonErrorResponseDto,
  })
  @Roles(ERole.ADMIN)
  async updateOrderProduct(
    @Param('id') _: string,
    @Param('orderProductId') orderProductId: string,
    @Body() dto: UpdateOrderProductDto,
  ): Promise<void> {
    await this.service.updateOrderProduct(+orderProductId, dto);
  }

  @Delete(':orderProductId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить заказанный продукт по id' })
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
  async deleteOrderProduct(
    @Param('id') _: string,
    @Param('orderProductId') orderProductId: string,
  ): Promise<void> {
    await this.service.deleteOrderProduct(+orderProductId);
  }
}
