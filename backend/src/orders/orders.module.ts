import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';
import { CartItem } from '../cart/cart-item.entity';  // ⭐ ADD

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, CartItem]),  // ⭐ ADD CartItem
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}