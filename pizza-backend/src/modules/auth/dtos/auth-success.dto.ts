import { ApiProperty } from '@nestjs/swagger';

export class AuthSuccessDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
