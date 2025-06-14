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
import { configSchema } from 'src/libs/config/schema.config';
import { getRedisConfig } from 'src/libs/config/redis.config';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { OrderProductsModule } from './order-products/order-products.module';
import { CategoriesModule } from './categories/categories.module';
import { RegionsModule } from './regions/regions.module';
import { CitiesModule } from './cities/cities.module';
import { IngredientsModule } from './ingredients/ingredients.module';

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
    CategoriesModule,
    RegionsModule,
    CitiesModule,
    ProductsModule,
    IngredientsModule,
    OrdersModule,
    OrderProductsModule,
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
