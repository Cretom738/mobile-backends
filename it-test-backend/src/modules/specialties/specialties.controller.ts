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
import { SpecialtiesService } from './specialties.service';
import { SpecialityDto } from './dtos/speciality.dto';
import { CreateSpecialityDto } from './dtos/create-speciality.dto';
import { UpdateSpecialityDto } from './dtos/update-speciality.dto';
import { ERole, Speciality } from '@prisma/client';
import { ApiOkPaginatedResponse } from 'src/libs/decorators/paginated-response.decorator';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { PaginatedResponseDto } from 'src/libs/dtos/paginated-response.dto';
import { RoleGuard } from 'src/libs/guards/role.guard';
import { Roles } from 'src/libs/decorators/role.decorator';
import { FilterSpecialityDto } from './dtos/filter-speciality.dto';
import { AuthGuard } from 'src/libs/guards/auth.guard';

@Controller('specialties')
@ApiTags('Specialties')
@UseGuards(AuthGuard)
export class SpecialtiesController {
  constructor(private readonly service: SpecialtiesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать специальность' })
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
  async createSpeciality(@Body() dto: CreateSpecialityDto): Promise<void> {
    await this.service.createSpeciality(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список специальностей' })
  @ApiOkPaginatedResponse(SpecialityDto)
  @ApiBadRequestResponse({
    description: 'Ошибка валидации',
    type: BadErrorRequestDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  async findSpecialties(
    @Query() filterData: FilterSpecialityDto,
  ): Promise<PaginatedResponseDto<SpecialityDto>> {
    const [specialties, count] = await this.service.findSpecialties(filterData);

    return new PaginatedResponseDto({
      result: specialties.map((r) => new SpecialityDto(r)),
      count,
      offset: filterData.offset,
      limit: filterData.limit,
      sortOrder: filterData.sortOrder,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить специальность по id' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: SpecialityDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  async findSpecialityById(@Param('id') id: string): Promise<SpecialityDto> {
    const speciality: Speciality = await this.service.findSpecialityById(+id);

    return new SpecialityDto(speciality);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить специальность по id' })
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
  async updateSpeciality(
    @Param('id') id: string,
    @Body() dto: UpdateSpecialityDto,
  ): Promise<void> {
    await this.service.updateSpeciality(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить специальность по id' })
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
  async deleteSpeciality(@Param('id') id: number): Promise<void> {
    await this.service.deleteSpeciality(+id);
  }
}
