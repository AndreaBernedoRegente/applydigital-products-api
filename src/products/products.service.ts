import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
import { ContentfulService } from '../contentful/contentful.service';
import { ProductQueryDto } from './products.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private contentfulService: ContentfulService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async syncProductsFromContentful() {
    this.logger.log('Start sync products from Contentful');
    const entries = await this.contentfulService.fetchAllProducts();

    const results = await Promise.allSettled(
      entries.map(async (entry) => {
        try {
          const { fields, sys } = entry;

          const existing = await this.productModel.findOne({
            contentfulId: sys.id,
          });

          if (existing?.isDeleted) {
            return 'skipped';
          }

          await this.productModel.findOneAndUpdate(
            { contentfulId: sys.id },
            {
              sku: fields.sku,
              name: fields.name,
              brand: fields.brand,
              model: fields.model,
              category: fields.category,
              color: fields.color,
              price: fields.price,
              currency: fields.currency,
              stock: fields.stock,
              contentfulId: sys.id,
              contentfulData: entry,
              isDeleted: false,
            },
            { upsert: true, new: true },
          );

          return 'success';
        } catch (error) {
          this.logger.error(`Error syncing product ${entry?.sys?.id}`, error);
          throw error;
        }
      }),
    );

    const fulfilled = results.filter((r) => r.status === 'fulfilled').length;
    const rejected = results.filter((r) => r.status === 'rejected').length;

    this.logger.log(
      `Sync completed. Successful: ${fulfilled}, Failed: ${rejected}`,
    );
  }

  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 5, filters = {} } = query;

    const mongoFilters: any = { isDeleted: false };

    if (filters.name) {
      mongoFilters.name = { $regex: filters.name, $options: 'i' };
    }
    if (filters.category) {
      mongoFilters.category = filters.category;
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      mongoFilters.price = {};
      if (filters.minPrice !== undefined)
        mongoFilters.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined)
        mongoFilters.price.$lte = filters.maxPrice;
      if (Object.keys(mongoFilters.price).length === 0)
        delete mongoFilters.price;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.productModel
        .find(mongoFilters)
        .skip(skip)
        .limit(Math.min(limit, 5))
        .exec(),
      this.productModel.countDocuments(mongoFilters),
    ]);

    return {
      data,
      total,
      page,
      limit: Math.min(limit, 5),
      totalPages: Math.ceil(total / Math.min(limit, 5)),
    };
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.productModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );
    return !!result;
  }
}
