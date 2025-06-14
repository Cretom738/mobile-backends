import { Product } from '@prisma/client';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { FilterProductDto } from './dtos/filter-product.dto';

export interface IProductsService {
  createProduct(dto: CreateProductDto): Promise<void>;

  findProducts(filterData: FilterProductDto): Promise<[Product[], number]>;

  findProductById(id: number): Promise<Product>;

  updateProduct(id: number, dto: UpdateProductDto): Promise<void>;

  deleteProduct(id: number): Promise<void>;
}
