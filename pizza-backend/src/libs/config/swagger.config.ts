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
    .setTitle('Pizza API')
    .setDescription('Документация API для приложения доставки пиццы')
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
    .addTag('Categories', 'Взаимодействие с категориями')
    .addTag('Cities', 'Взаимодействие с городами')
    .addTag('Files', 'Взаимодействие с файлами')
    .addTag('Ingredients', 'Взаимодействие с ингредиентами')
    .addTag('OrderProducts', 'Взаимодействие с заказанными продуктами')
    .addTag('Orders', 'Взаимодействие с заказами')
    .addTag('Products', 'Взаимодействие с продуктами')
    .addTag('Regions', 'Взаимодействие с регионами')
    .addTag('Users', 'Взаимодействие с пользователями')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('/api/docs', app, document);
}
