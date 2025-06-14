import { Injectable } from '@nestjs/common';
import { IRegionsService } from './regions';
import { CreateRegionDto } from './dtos/create-region.dto';
import { UpdateRegionDto } from './dtos/update-region.dto';
import { PrismaService } from 'src/libs/services/prisma.service';
import { Region } from '@prisma/client';

@Injectable()
export class RegionsService implements IRegionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRegion(dto: CreateRegionDto): Promise<void> {
    await this.prisma.region.create({
      data: {
        ...dto,
      },
    });
  }

  async findAllRegions(): Promise<Region[]> {
    return this.prisma.region.findMany();
  }

  async findRegionById(id: number): Promise<Region> {
    return this.prisma.region.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async updateRegion(id: number, dto: UpdateRegionDto): Promise<void> {
    await this.prisma.region.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteRegion(id: number): Promise<void> {
    await this.prisma.region.delete({
      where: {
        id,
      },
    });
  }
}
