import { Module } from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';
import { SpecialtiesController } from './specialties.controller';
import { PrismaService } from 'src/libs/services/prisma.service';

@Module({
  providers: [SpecialtiesService, PrismaService],
  controllers: [SpecialtiesController],
})
export class SpecialtiesModule {}
