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
import { RegionsService } from './regions.service';
import { RegionDto } from './dtos/region.dto';
import { CreateRegionDto } from './dtos/create-region.dto';
import { UpdateRegionDto } from './dtos/update-region.dto';
import { ERole, Region } from '@prisma/client';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { Roles } from 'src/libs/decorators/role.decorator';
import { RoleGuard } from 'src/libs/guards/role.guard';
import { AuthGuard } from 'src/libs/guards/auth.guard';

@Controller('regions')
@ApiTags('Regions')
@UseGuards(AuthGuard)
export class RegionsController {
  constructor(private readonly service: RegionsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать регион' })
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
  @Roles(ERole.ADMIN)
  @UseGuards(RoleGuard)
  async createRegion(@Body() dto: CreateRegionDto): Promise<void> {
    await this.service.createRegion(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список регионов' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: RegionDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  async findAllRegions(): Promise<RegionDto[]> {
    const regions: Region[] = await this.service.findAllRegions();

    return regions.map((r) => new RegionDto(r));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить регион по id' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: RegionDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  async findRegionById(@Param('id') id: string): Promise<RegionDto> {
    const region: Region = await this.service.findRegionById(+id);

    return new RegionDto(region);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить регион по id' })
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
  async updateRegion(
    @Param('id') id: string,
    @Body() dto: UpdateRegionDto,
  ): Promise<void> {
    await this.service.updateRegion(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить регион по id' })
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
  async deleteRegion(@Param('id') id: string): Promise<void> {
    await this.service.deleteRegion(+id);
  }
}
