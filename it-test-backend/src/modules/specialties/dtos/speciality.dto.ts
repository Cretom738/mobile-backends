import { ApiProperty } from '@nestjs/swagger';
import { CreateSpecialityDto } from './create-speciality.dto';
import { Speciality } from '@prisma/client';

export class SpecialityDto extends CreateSpecialityDto {
  @ApiProperty()
  readonly id: number;

  constructor(speciality: Speciality) {
    super();
    this.id = speciality.id;
    this.title = speciality.title;
    this.code = speciality.code;
    this.description = speciality.description;
  }
}
