import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { PrismaErrorFilter } from '../libs/filters/prisma-error.filter';
import { TransformInterceptor } from '../libs/interceptors/transform.interceptor';
import { setupOpenApi } from 'src/libs/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    bufferLogs: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(new PrismaErrorFilter());

  app.setGlobalPrefix('api');

  const configService = app.get<ConfigService>(ConfigService);

  const port = parseInt(configService.get('APP_PORT'));

  if (process.env.NODE_ENV !== 'production') {
    setupOpenApi(app);
  }

  await app.listen(port);
}
bootstrap();
