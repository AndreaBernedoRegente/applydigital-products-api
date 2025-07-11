import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './products.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiResponse({ status: 200, description: 'Paginated list of products' })
  @Get()
  async findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    const deleted = await this.productsService.softDelete(id);
    if (!deleted) {
      throw new NotFoundException('Product not found');
    }
    return { message: 'Product deleted successfully' };
  }

  //only for testing
  @Post('sync')
  async forceSync() {
    await this.productsService.syncProductsFromContentful();
    return { message: 'Sync completed' };
  }
}
