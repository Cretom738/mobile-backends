import {
  Controller,
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FileDto } from './dtos/file.dto';
import { AuthGuard } from 'src/libs/guards/auth.guard';
import { CommonErrorResponseDto } from 'src/libs/dtos/common-error-response.dto';
import { BadErrorRequestDto } from 'src/libs/dtos/bad-request-error.dto';

@Controller('files')
@ApiTags('Files')
@UseGuards(AuthGuard)
export class FilesController {
  constructor(private readonly service: FilesService) {}

  @Post('image')
  @ApiOperation({ summary: 'Загрузка изображения' })
  @ApiCreatedResponse({
    description: 'Файл загружен',
    type: FileDto,
  })
  @ApiBadRequestResponse({
    description: 'Загрузка файла не удалась',
    type: BadErrorRequestDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Не авторизован',
    type: CommonErrorResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Неверный формат файла',
    type: CommonErrorResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /\/(jpeg|png|jpg)$/ }),
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
  ): Promise<FileDto> {
    const url: string = await this.service.uploadFile({
      fileName: file.originalname,
      dataBuffer: file.buffer,
      contentType: file.mimetype,
    });

    return new FileDto(url);
  }
}
