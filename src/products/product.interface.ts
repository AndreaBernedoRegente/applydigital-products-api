export interface IProduct {
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  color?: string;
  price: number;
  currency: string;
  stock: number;
  contentfulId: string;
  isDeleted: boolean;
  deletedAt?: Date;
  contentfulData?: any;
}
