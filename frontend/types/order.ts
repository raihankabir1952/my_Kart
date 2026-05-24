import { User } from './user';
import { Product } from './product';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number | string;
  quantity: number;
  subtotal: number | string;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  subtotal: number | string;
  shipping?: number | string;
  shippingCost?: number | string;
  total: number | string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentTransactionId?: string;
  shippingName?: string;
  shippingAddress: string;
  shippingCity?: string;
  shippingPostal?: string;
  shippingPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}