import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

import { Order } from '../orders/entities/order.entity';
import { CartItem } from '../cart/entities/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      CartItem,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}