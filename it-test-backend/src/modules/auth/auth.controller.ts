import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { AuthSuccessDto } from 'src/modules/auth/dtos/auth-success.dto';
import { AuthDto } from 'src/modules/auth/dtos/auth.dto';
import { UserInfo } from 'src/libs/decorators/user-info.decorator';
import { AuthGuard } from 'src/libs/guards/auth.guard';
import { RefreshDto } from 'src/modules/auth/dtos/refresh.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiCreatedResponse({
    description: 'Ресурс создан',
    type: AuthSuccessDto,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации',
    type: BadErrorRequestDto,
  })
  @ApiConflictResponse({
    description: 'Конфликт с состоянием сервера',
    type: CommonErrorResponseDto,
  })
  async register(@Body() dto: CreateUserDto): Promise<AuthSuccessDto> {
    return this.service.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход в аккаунт' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: AuthSuccessDto,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации',
    type: BadErrorRequestDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  async login(@Body() dto: AuthDto): Promise<AuthSuccessDto> {
    return this.service.login(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Выход из аккаунта' })
  @ApiNoContentResponse({
    description: 'Выполнено успешно',
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  @UseGuards(AuthGuard)
  async logout(@UserInfo() { deviceId }: IJwtPayload): Promise<void> {
    await this.service.logout(deviceId);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление токена' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: AuthSuccessDto,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации',
    type: BadErrorRequestDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  async refresh(@Body() { refreshToken }: RefreshDto): Promise<AuthSuccessDto> {
    return this.service.refresh(refreshToken);
  }
}
