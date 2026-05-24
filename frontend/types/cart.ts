import { Product } from './product';

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: Product;       // eager loaded
  createdAt: string;
  updatedAt: string;
}