import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product {
  @Prop({ required: true, unique: true })
  contentfulId: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  color?: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true, type: Number })
  stock: number;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: Object })
  contentfulData: any;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
