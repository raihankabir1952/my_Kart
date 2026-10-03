import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingsGateway } from './ratings.gateway';

import { Product } from '../products/entities/product.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingsRepo: Repository<Rating>,

    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,

    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,

    private readonly ratingsGateway: RatingsGateway,
  ) {}

  async createOrUpdate(
    userId: string,
    dto: CreateRatingDto,
  ) {
    const product = await this.productsRepo.findOne({
      where: {
        id: dto.productId,
      },
    });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    const orders = await this.ordersRepo.find({
      where: {
        userId,
      },
      relations: {
        items: true,
      },
    });

    const hasPurchased = orders.some(
      (order) =>
        order.status !== OrderStatus.CANCELLED &&
        order.items?.some(
          (item) =>
            item.productId === dto.productId,
        ),
    );

    if (!hasPurchased) {
      throw new ForbiddenException(
        'You can only rate products you have purchased.',
      );
    }

    let rating = await this.ratingsRepo.findOne({
      where: {
        userId,
        productId: dto.productId,
      },
    });

    if (rating) {
      rating.rating = dto.rating;
    } else {
      rating = this.ratingsRepo.create({
        userId,
        productId: dto.productId,
        rating: dto.rating,
      });
    }

    await this.ratingsRepo.save(rating);

    // Get latest ratings
    const ratings = await this.ratingsRepo.find({
      where: {
        productId: dto.productId,
      },
    });

    const totalRatings = ratings.length;

    const averageRating =
      totalRatings > 0
        ? ratings.reduce(
            (sum, item) => sum + item.rating,
            0,
          ) / totalRatings
        : 0;

    const ratingSummary = {
      averageRating: Number(
        averageRating.toFixed(1),
      ),
      totalRatings,
    };

    // Send real-time update
    this.ratingsGateway.emitRatingUpdate(
      dto.productId,
      ratingSummary,
    );

    return {
      ...rating,
      ...ratingSummary,
    };
  }

  async getProductRatings(productId: string) {
    const ratings = await this.ratingsRepo.find({
      where: {
        productId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const totalRatings = ratings.length;

    const averageRating =
      totalRatings > 0
        ? ratings.reduce(
            (sum, item) => sum + item.rating,
            0,
          ) / totalRatings
        : 0;

    return {
      averageRating: Number(
        averageRating.toFixed(1),
      ),
      totalRatings,
      ratings,
    };
  }

  async getUserRating(
    userId: string,
    productId: string,
  ) {
    return this.ratingsRepo.findOne({
      where: {
        userId,
        productId,
      },
    });
  }
}