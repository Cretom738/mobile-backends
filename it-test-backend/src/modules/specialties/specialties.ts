import { Speciality } from '@prisma/client';
import { CreateSpecialityDto } from './dtos/create-speciality.dto';
import { UpdateSpecialityDto } from './dtos/update-speciality.dto';
import { FilterSpecialityDto } from './dtos/filter-speciality.dto';

export interface ISpecialtiesService {
  createSpeciality(dto: CreateSpecialityDto): Promise<void>;

  findSpecialties(
    filterData: FilterSpecialityDto,
  ): Promise<[Speciality[], number]>;

  findSpecialityById(id: number): Promise<Speciality>;

  updateSpeciality(id: number, dto: UpdateSpecialityDto): Promise<void>;

  deleteSpeciality(id: number): Promise<void>;
}
