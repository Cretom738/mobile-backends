import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { AuthMiddleware } from '../libs/middlewares/auth.middleware';
import { InternalJwtModule } from './internal-jwt/internal-jwt.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { QuizzesModule } from './quizzes/quizzes.module';
import { SpecialtiesModule } from './specialties/specialties.module';
import { QuestionsModule } from './questions/questions.module';
import { configSchema } from '../libs/config/schema.config';
import { getRedisConfig } from '../libs/config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configSchema,
    }),
    RedisModule.forRootAsync(getRedisConfig()),
    AuthModule,
    SessionsModule,
    InternalJwtModule,
    UsersModule,
    FilesModule,
    SpecialtiesModule,
    QuizzesModule,
    QuestionsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
