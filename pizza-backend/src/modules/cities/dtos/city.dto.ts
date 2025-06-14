import { ApiProperty } from '@nestjs/swagger';
import { CreateCityDto } from './create-city.dto';
import { City } from '@prisma/client';

export class CityDto extends CreateCityDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly regionId: number;

  constructor(city: City) {
    super();
    this.id = city.id;
    this.title = city.title;
    this.regionId = city.regionId;
  }
}
