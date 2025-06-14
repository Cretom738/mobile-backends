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
import { QuestionsService } from './questions.service';
import { RoleGuard } from 'src/libs/guards/role.guard';
import { Roles } from 'src/libs/decorators/role.decorator';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { ERole } from '@prisma/client';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';

@ApiTags('Questions')
@Controller('quizzes/:id/questions')
@UseGuards(RoleGuard)
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать вопрос' })
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
  async createQuestion(
    @Param('id') id: string,
    @Body() dto: CreateQuestionDto,
  ): Promise<void> {
    await this.service.createQuestion(+id, dto);
  }

  @Patch(':questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Изменить вопрос по id' })
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
  async updateQuestion(
    @Param('id') _: string,
    @Param('questionId') questionId: string,
    @Body() dto: UpdateQuestionDto,
  ): Promise<void> {
    await this.service.updateQuestion(+questionId, dto);
  }

  @Delete(':questionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить вопрос по id' })
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
  async deleteQuestion(
    @Param('id') _: string,
    @Param('questionId') questionId: string,
  ): Promise<void> {
    await this.service.deleteQuestion(+questionId);
  }
}
