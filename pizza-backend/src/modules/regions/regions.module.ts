import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { PrismaService } from 'src/libs/services/prisma.service';

@Module({
  providers: [RegionsService, PrismaService],
  controllers: [RegionsController],
})
export class RegionsModule {}
