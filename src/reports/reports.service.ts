import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/products.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getDeletedPercentage() {
    const total = await this.productModel.countDocuments();
    const deleted = await this.productModel.countDocuments({ isDeleted: true });
    const percentage = total === 0 ? 0 : (deleted / total) * 100;
    return { total, deleted, percentage: percentage.toFixed(2) + '%' };
  }

  async getNonDeletedPercentage(params: {
    withPrice?: boolean;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const { withPrice, dateFrom, dateTo } = params;
    const filter: any = { isDeleted: false };

    if (withPrice !== undefined) {
      filter.price = withPrice ? { $ne: null } : null;
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
      if (Object.keys(filter.createdAt).length === 0) delete filter.createdAt;
    }

    const total = await this.productModel.countDocuments({ isDeleted: false });
    const filtered = await this.productModel.countDocuments(filter);
    const percentage = total === 0 ? 0 : (filtered / total) * 100;
    return { total, filtered, percentage: percentage.toFixed(2) + '%' };
  }

  async getAveragePrice() {
    const result = await this.productModel.aggregate([
      { $match: { isDeleted: false, price: { $ne: null } } },
      { $group: { _id: null, avgPrice: { $avg: '$price' } } },
    ]);
    return { averagePrice: result[0]?.avgPrice ?? 0 };
  }
}
