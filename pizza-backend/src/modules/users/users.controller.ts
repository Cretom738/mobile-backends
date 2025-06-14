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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserInfo } from 'src/libs/decorators/user-info.decorator';
import { UsersService } from './users.service';
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';
import { UserDto } from './dtos/user.dto';
import { UpdateCurrentUserDto } from './dtos/update-current-user.dto';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { RoleGuard } from 'src/libs/guards/role.guard';
import { Roles } from 'src/libs/decorators/role.decorator';
import { ERole } from '@prisma/client';
import { ApiOkPaginatedResponse } from 'src/libs/decorators/paginated-response.decorator';
import { PaginatedResponseDto } from 'src/libs/dtos/paginated-response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FilterUsersDto } from './dtos/filter-users.dto';
import { AuthGuard } from 'src/libs/guards/auth.guard';

@Controller('users')
@ApiTags('Users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiCreatedResponse({
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
  @ApiConflictResponse({
    description: 'Конфликт с состоянием сервера',
    type: CommonErrorResponseDto,
  })
  @Roles(ERole.ADMIN)
  @UseGuards(RoleGuard)
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    await this.service.createUser(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список пользователей' })
  @ApiOkPaginatedResponse(UserDto)
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
  @Roles(ERole.ADMIN)
  @UseGuards(RoleGuard)
  async findUsers(
    @Query() filterData: FilterUsersDto,
  ): Promise<PaginatedResponseDto<UserDto>> {
    const [users, count] = await this.service.findUsers(filterData);

    return new PaginatedResponseDto({
      result: users.map((user) => new UserDto(user)),
      count,
      offset: filterData.offset,
      limit: filterData.limit,
      sortOrder: filterData.sortOrder,
    });
  }

  @Get('me')
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  async findCurrentUser(@UserInfo() { userId }: IJwtPayload): Promise<UserDto> {
    const user = await this.service.findUserById(userId);

    return new UserDto(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по id' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: UserDto,
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
  async findUserById(@Param('id') id: string): Promise<UserDto> {
    const user = await this.service.findUserById(+id);

    return new UserDto(user);
  }

  @Patch('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить текущего пользователя' })
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
  @ApiConflictResponse({
    description: 'Конфликт с состоянием сервера',
    type: CommonErrorResponseDto,
  })
  async updateCurrentUser(
    @Body() dto: UpdateCurrentUserDto,
    @UserInfo() { userId }: IJwtPayload,
  ): Promise<void> {
    await this.service.updateUser(userId, dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить пользователя по id' })
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
  @ApiConflictResponse({
    description: 'Конфликт с состоянием сервера',
    type: CommonErrorResponseDto,
  })
  @Roles(ERole.ADMIN)
  @UseGuards(RoleGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.service.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить пользователя по id' })
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
  async removeUser(@Param('id') id: string): Promise<void> {
    await this.service.removeUser(+id);
  }
}
