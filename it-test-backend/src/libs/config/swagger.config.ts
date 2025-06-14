import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressBasicAuth from 'express-basic-auth';

export function setupOpenApi(app: INestApplication): void {
  const configService = app.get<ConfigService>(ConfigService);

  const password = configService.get('SWAGGER_PASSWORD');

  if (password) {
    app.use(
      '/api/docs*',
      expressBasicAuth({
        challenge: true,
        users: {
          admin: password,
        },
      }),
    );
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('IT Test API')
    .setDescription(
      'Документация API приложения для тестирования по специальности',
    )
    .setVersion('1.0')
    .addServer(configService.get('SWAGGER_TARGET_SERVER_URL'))
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Введите JWT токен',
    })
    .addSecurityRequirements('bearer')
    .addTag('Auth', 'Взаимодействие с авторизация')
    .addTag('Files', 'Взаимодействие с файлами')
    .addTag('Questions', 'Взаимодействие с вопросами')
    .addTag('Quizzes', 'Взаимодействие с квизами')
    .addTag('Specialties', 'Взаимодействие со специальностями')
    .addTag('Users', 'Взаимодействие с пользователями')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/api/docs', app, document);
}
