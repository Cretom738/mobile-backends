import { Injectable } from '@nestjs/common';
import { ISpecialtiesService } from './specialties';
import { CreateSpecialityDto } from './dtos/create-speciality.dto';
import { UpdateSpecialityDto } from './dtos/update-speciality.dto';
import { PrismaService } from 'src/libs/services/prisma.service';
import { Prisma, Speciality } from '@prisma/client';
import { FilterSpecialityDto } from './dtos/filter-speciality.dto';

@Injectable()
export class SpecialtiesService implements ISpecialtiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createSpeciality(dto: CreateSpecialityDto): Promise<void> {
    await this.prisma.speciality.create({
      data: {
        ...dto,
      },
    });
  }

  async findSpecialties({
    title,
    offset,
    limit,
    sortOrder,
  }: FilterSpecialityDto): Promise<[Speciality[], number]> {
    const query: Prisma.SpecialityFindManyArgs = {
      where: {
        title: {
          contains: title,
        },
      },
    };

    return this.prisma.$transaction([
      this.prisma.speciality.findMany({
        where: query.where,
        skip: offset,
        take: limit,
        orderBy: {
          id: sortOrder,
        },
      }),
      this.prisma.speciality.count({
        where: query.where,
      }),
    ]);
  }

  async findSpecialityById(id: number): Promise<Speciality> {
    return this.prisma.speciality.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async updateSpeciality(id: number, dto: UpdateSpecialityDto): Promise<void> {
    await this.prisma.speciality.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteSpeciality(id: number): Promise<void> {
    await this.prisma.speciality.delete({
      where: {
        id,
      },
    });
  }
}
