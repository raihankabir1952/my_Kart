import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(
    private readonly ratingsService: RatingsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrUpdate(
    @Req() req: any,
    @Body() dto: CreateRatingDto,
  ) {
    return this.ratingsService.createOrUpdate(
      req.user.id,
      dto,
    );
  }

  @Get('product/:productId')
  getProductRatings(
    @Param('productId') productId: string,
  ) {
    return this.ratingsService.getProductRatings(
      productId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('product/:productId/me')
  getUserRating(
    @Req() req: any,
    @Param('productId') productId: string,
  ) {
    return this.ratingsService.getUserRating(
      req.user.id,
      productId,
    );
  }
}
