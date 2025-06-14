import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty()
  readonly url: string;

  constructor(url: string) {
    this.url = url;
  }
}
