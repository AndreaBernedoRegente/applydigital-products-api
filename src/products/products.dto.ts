import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;

  @IsNumber()
  stock: number;

  @IsString()
  contentfulId: string;
}

export class ProductFiltersDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Filter by product name' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Product category' })
  category?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @ApiPropertyOptional({ description: 'Minimum price' })
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @ApiPropertyOptional({ description: 'Maximum price' })
  maxPrice?: number;
}

export class ProductQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @ApiPropertyOptional({ default: 1, description: 'Page number' })
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @ApiPropertyOptional({ default: 5, description: 'Items per page (max 5)' })
  limit?: number = 5;

  @ApiPropertyOptional({ type: ProductFiltersDto })
  filters?: ProductFiltersDto;
}
