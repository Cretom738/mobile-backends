import { ERole, User } from '@prisma/client';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UserDto extends OmitType(CreateUserDto, ['password']) {
  @ApiProperty()
  readonly id: number;

  @ApiProperty({ enum: ERole })
  readonly role: ERole;

  constructor(user: User) {
    super();
    this.id = user.id;
    this.fullName = user.fullName;
    this.email = user.email;
    this.role = user.role;
  }
}
