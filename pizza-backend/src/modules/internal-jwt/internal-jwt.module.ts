import { Module } from '@nestjs/common';
import { InternalJwtService } from './internal-jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/libs/config/jwt.config';

@Module({
  imports: [JwtModule.registerAsync(getJwtConfig())],
  providers: [InternalJwtService],
  exports: [InternalJwtService],
})
export class InternalJwtModule {}
