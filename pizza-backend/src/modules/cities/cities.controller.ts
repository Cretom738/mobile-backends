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
  UseGuards,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
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
import { CityDto } from 'src/modules/cities/dtos/city.dto';
import { CreateCityDto } from 'src/modules/cities/dtos/create-city.dto';
import { UpdateCityDto } from 'src/modules/cities/dtos/update-city.dto';
import { City, ERole } from '@prisma/client';
import { AuthGuard } from 'src/libs/guards/auth.guard';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { RoleGuard } from 'src/libs/guards/role.guard';
import { Roles } from 'src/libs/decorators/role.decorator';

@Controller('regions/:regionId/cities')
@ApiTags('Cities')
@UseGuards(AuthGuard)
export class CitiesController {
  constructor(private readonly service: CitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать город' })
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
  @Roles(ERole.ADMIN)
  @UseGuards(RoleGuard)
  async createCity(
    @Param('regionId') regionId: string,
    @Body() dto: CreateCityDto,
  ): Promise<void> {
    await this.service.createCity(+regionId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список городов по id региона' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: CityDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  async findCitiesByRegionId(
    @Param('regionId') regionId: string,
  ): Promise<CityDto[]> {
    const cities: City[] = await this.service.findCitiesByRegionId(+regionId);

    return cities.map((c) => new CityDto(c));
  }

  @Get(':cityId')
  @ApiOperation({ summary: 'Получить город по id' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: CityDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  async findCityById(@Param('cityId') cityId: string): Promise<CityDto> {
    const city: City = await this.service.findCityById(+cityId);

    return new CityDto(city);
  }

  @Patch(':cityId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить город по id' })
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
  @Roles(ERole.ADMIN)
  @UseGuards(RoleGuard)
  async updateCity(
    @Param('regionId') regionId: string,
    @Param('cityId') cityId: string,
    @Body() dto: UpdateCityDto,
  ): Promise<void> {
    await this.service.updateCity(+regionId, +cityId, dto);
  }

  @Delete(':cityId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить город по id' })
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
  async deleteCity(
    @Param('regionId') _: string,
    @Param('cityId') cityId: string,
  ): Promise<void> {
    await this.service.deleteCity(+cityId);
  }
}
