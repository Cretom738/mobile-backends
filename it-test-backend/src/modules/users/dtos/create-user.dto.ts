import { IsNotEmpty, IsString } from 'class-validator';
import { AuthDto } from '../../auth/dtos/auth.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto extends AuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;
}
