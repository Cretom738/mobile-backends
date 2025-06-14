import { ApiProperty } from '@nestjs/swagger';
import { PaginatedRequestDto } from './paginated-request.dto';

export class PaginatedResponseDto<T> extends PaginatedRequestDto {
  @ApiProperty()
  readonly count: number;

  @ApiProperty({ isArray: true })
  readonly result: T[];

  constructor(data: PaginatedResponseDto<T>) {
    super();
    this.count = data.count;
    this.limit = data.limit;
    this.offset = data.offset;
    this.sortOrder = data.sortOrder;
    this.result = data.result;
  }
}
