import { City } from '@prisma/client';
import { CreateCityDto } from 'src/modules/cities/dtos/create-city.dto';
import { UpdateCityDto } from 'src/modules/cities/dtos/update-city.dto';

export interface ICitiesService {
  createCity(regionId: number, dto: CreateCityDto): Promise<void>;

  findCitiesByRegionId(regionId: number): Promise<City[]>;

  findCityById(cityId: number): Promise<City>;

  updateCity(
    regionId: number,
    cityId: number,
    dto: UpdateCityDto,
  ): Promise<void>;

  deleteCity(cityId: number): Promise<void>;
}
