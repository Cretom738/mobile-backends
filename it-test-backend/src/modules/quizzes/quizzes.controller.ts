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
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dtos/create-quiz.dto';
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
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { UserInfo } from 'src/libs/decorators/user-info.decorator';
import { Roles } from 'src/libs/decorators/role.decorator';
import { RoleGuard } from 'src/libs/guards/role.guard';
import { ERole } from '@prisma/client';
import { UpdateQuizDto } from './dtos/update-quiz.dto';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';
import { PaginatedResponseDto } from 'src/libs/dtos/paginated-response.dto';
import { QuizDto } from './dtos/quiz.dto';
import { FilterQuizDto } from './dtos/filter-quiz.dto';
import { ResultDto } from './dtos/result.dto';
import { ApiOkPaginatedResponse } from 'src/libs/decorators/paginated-response.decorator';
import { QuizzesDto } from './dtos/quizzes.dto';
import { IJwtPayload } from 'src/libs/ts/interfaces/jwt-payload.interface';
import { PaginatedRequestDto } from 'src/libs/dtos/paginated-request.dto';
import { SubmitAnswersDto } from './dtos/submit-anwsers.dto';
import { AuthGuard } from 'src/libs/guards/auth.guard';

@ApiTags('Quizzes')
@Controller('quizzes')
@UseGuards(AuthGuard)
export class QuizzesController {
  constructor(private readonly service: QuizzesService) {}

  @Post()
  @ApiOperation({ summary: 'Создать квиз' })
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
  async createQuiz(@Body() dto: CreateQuizDto): Promise<void> {
    await this.service.createQuiz(dto);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Начать квиз' })
  @ApiCreatedResponse({
    description: 'Ресурс создан',
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
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
  async startQuiz(
    @Param('id') id: string,
    @UserInfo() user: IJwtPayload,
  ): Promise<void> {
    await this.service.startQuiz(+id, user);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Отправить ответы и завершить квиз' })
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
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'Конфликт с состоянием сервера',
    type: CommonErrorResponseDto,
  })
  async submitAnswers(
    @Param('id') id: string,
    @Body() dto: SubmitAnswersDto,
    @UserInfo() user: IJwtPayload,
  ): Promise<void> {
    await this.service.submitAnswers(+id, dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список квизов' })
  @ApiOkPaginatedResponse(QuizzesDto)
  @ApiBadRequestResponse({
    description: 'Ошибка валидации',
    type: BadErrorRequestDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  async findQuizzes(
    @Query() filterData: FilterQuizDto,
  ): Promise<PaginatedResponseDto<QuizzesDto>> {
    const [quizzes, count] = await this.service.findQuizzes(filterData);

    return new PaginatedResponseDto({
      result: quizzes.map((e) => new QuizzesDto(e)),
      count,
      offset: filterData.offset,
      limit: filterData.limit,
      sortOrder: filterData.sortOrder,
    });
  }

  @Get(':id/results')
  @ApiOperation({
    summary: 'Получить список результатов пользователя по id квиза',
  })
  @ApiOkPaginatedResponse(QuizzesDto)
  @ApiBadRequestResponse({
    description: 'Ошибка валидации',
    type: BadErrorRequestDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  async findResults(
    @Param('id') id: string,
    @Query() filterData: PaginatedRequestDto,
    @UserInfo() user: IJwtPayload,
  ): Promise<PaginatedResponseDto<ResultDto>> {
    const [results, count] = await this.service.findResults(
      +id,
      filterData,
      user,
    );

    return new PaginatedResponseDto({
      result: results.map((e) => new ResultDto(e)),
      count,
      offset: filterData.offset,
      limit: filterData.limit,
      sortOrder: filterData.sortOrder,
    });
  }

  @Get(':id/results/all')
  @ApiOperation({ summary: 'Получить список всех результатов по id квиза' })
  @ApiOkPaginatedResponse(QuizzesDto)
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
  async findAllQuizResults(
    @Param('id') id: string,
    @Query() filterData: PaginatedRequestDto,
  ): Promise<PaginatedResponseDto<ResultDto>> {
    const [results, count] = await this.service.findAllQuizResults(
      +id,
      filterData,
    );

    return new PaginatedResponseDto({
      result: results.map((e) => new ResultDto(e)),
      count,
      offset: filterData.offset,
      limit: filterData.limit,
      sortOrder: filterData.sortOrder,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить квиз по id' })
  @ApiOkResponse({
    description: 'Выполнено успешно',
    type: QuizDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Не найдено',
    type: CommonErrorResponseDto,
  })
  async findQuizById(
    @Param('id') id: string,
    @UserInfo() user: IJwtPayload,
  ): Promise<QuizDto> {
    const quiz = await this.service.findQuizById(+id, user);

    return new QuizDto(quiz, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить квиз по id' })
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
  async updateQuiz(
    @Param('id') id: string,
    @Body() dto: UpdateQuizDto,
  ): Promise<void> {
    await this.service.updateQuiz(+id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить квиз по id' })
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
  async deleteQuiz(@Param('id') id: string): Promise<void> {
    await this.service.deleteQuiz(+id);
  }
}
