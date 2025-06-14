import { Region } from '@prisma/client';
import { CreateRegionDto } from './dtos/create-region.dto';
import { UpdateRegionDto } from './dtos/update-region.dto';

export interface IRegionsService {
  createRegion(dto: CreateRegionDto): Promise<void>;

  findAllRegions(): Promise<Region[]>;

  findRegionById(id: number): Promise<Region>;

  updateRegion(id: number, dto: UpdateRegionDto): Promise<void>;

  deleteRegion(id: number): Promise<void>;
}
