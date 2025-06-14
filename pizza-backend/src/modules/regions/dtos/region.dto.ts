import { ApiProperty } from '@nestjs/swagger';
import { CreateRegionDto } from './create-region.dto';
import { Region } from '@prisma/client';

export class RegionDto extends CreateRegionDto {
  @ApiProperty()
  readonly id: number;

  constructor(region: Region) {
    super();
    this.title = region.title;
    this.id = region.id;
  }
}
