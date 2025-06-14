import { Injectable } from '@nestjs/common';
import { CreateCityDto } from 'src/modules/cities/dtos/create-city.dto';
import { PrismaService } from 'src/libs/services/prisma.service';
import { ICitiesService } from './cities';
import { UpdateCityDto } from 'src/modules/cities/dtos/update-city.dto';
import { City } from '@prisma/client';

@Injectable()
export class CitiesService implements ICitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCity(regionId: number, dto: CreateCityDto): Promise<void> {
    await this.prisma.city.create({
      data: {
        regionId,
        ...dto,
      },
    });
  }

  async findCitiesByRegionId(regionId: number): Promise<City[]> {
    return this.prisma.city.findMany({
      where: {
        regionId,
      },
    });
  }

  async findCityById(cityId: number): Promise<City> {
    return this.prisma.city.findUniqueOrThrow({
      where: {
        id: cityId,
      },
    });
  }

  async updateCity(
    regionId: number,
    cityId: number,
    dto: UpdateCityDto,
  ): Promise<void> {
    await this.prisma.city.update({
      where: {
        id: cityId,
      },
      data: {
        regionId,
        ...dto,
      },
    });
  }

  async deleteCity(cityId: number): Promise<void> {
    await this.prisma.city.delete({
      where: {
        id: cityId,
      },
    });
  }
}
