import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Rating } from './entities/rating.entity';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { RatingsGateway } from './ratings.gateway';

import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rating,
      Product,
      Order,
    ]),
  ],
  controllers: [RatingsController],
  providers: [
    RatingsService,
    RatingsGateway,
  ],
  exports: [RatingsService],
})
export class RatingsModule {}