import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
  ) {}

  // Current user er cart items
  async getCart(userId: string) {
    return this.cartRepo.find({ where: { userId } });
  }

  // Cart e add koro
  async addToCart(userId: string, dto: AddToCartDto) {
    // Same product already ache? Quantity barabo
    const existing = await this.cartRepo.findOne({
      where: { userId, productId: dto.productId },
    });
    if (existing) {
      existing.quantity += dto.quantity;
      return this.cartRepo.save(existing);
    }

    // Notun item
    const item = this.cartRepo.create({
      userId,
      productId: dto.productId,
      quantity: dto.quantity,
    });
    return this.cartRepo.save(item);
  }

  // Quantity change
  async updateQuantity(userId: string, itemId: string, quantity: number) {
    const item = await this.cartRepo.findOne({
      where: { id: itemId, userId }, // userId match - security check
    });
    if (!item) throw new NotFoundException('Cart item not found');
    item.quantity = quantity;
    return this.cartRepo.save(item);
  }

  // Item remove
  async removeItem(userId: string, itemId: string) {
    const item = await this.cartRepo.findOne({
      where: { id: itemId, userId },
    });
    if (!item) throw new NotFoundException('Cart item not found');
    await this.cartRepo.delete(itemId);
    return { deleted: true };
  }

  // Pura cart empty
  async clearCart(userId: string) {
    await this.cartRepo.delete({ userId });
    return { cleared: true };
  }
}