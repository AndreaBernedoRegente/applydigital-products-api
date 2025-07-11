import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './products.schema';
import { ProductsService } from './products.service';
import { ContentfulModule } from '../contentful/contentful.module';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ContentfulModule,
  ],
  providers: [ProductsService],
  exports: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
