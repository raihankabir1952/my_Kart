import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  // ----- CREATE ORDER -----
  async create(userId: string, dto: CreateOrderDto) {
    const items: Partial<OrderItem>[] = [];
    let subtotal = 0;

    // Loop through each requested item
    for (const i of dto.items) {
      // 1. Product exists?
      const product = await this.productsRepo.findOne({
        where: { id: i.productId },
      });
      if (!product) {
        throw new NotFoundException(`Product ${i.productId} not found`);
      }

      // 2. Stock available?
      if (product.stock < i.quantity) {
        throw new BadRequestException(
          `Not enough stock for ${product.name}. Available: ${product.stock}`,
        );
      }

      // 3. Calculate item subtotal
      const itemSubtotal = Number(product.price) * i.quantity;
      subtotal += itemSubtotal;

      // 4. Snapshot - lock the values
      items.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: i.quantity,
        subtotal: itemSubtotal,
      });

      // 5. Decrease stock
      product.stock -= i.quantity;
      await this.productsRepo.save(product);
    }

    // Shipping: free over 2000 BDT, else 60 BDT
    const shippingCost = subtotal > 2000 ? 0 : 60;
    const total = subtotal + shippingCost;

    // Create order
    const order = this.ordersRepo.create({
      orderNumber: `ORD-${Date.now()}`,
      userId,
      items: items as OrderItem[],
      subtotal,
      shippingCost,
      total,
      shippingAddress: dto.shippingAddress,
      shippingPhone: dto.shippingPhone,
      paymentMethod: dto.paymentMethod,
      notes: dto.notes,
    });

    return this.ordersRepo.save(order);
  }

  // ----- USER'S OWN ORDERS -----
  findUserOrders(userId: string) {
    return this.ordersRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: { items: true },
    });
  }

  // ----- SINGLE ORDER (with relations for detail page) -----
  async findOne(id: string, userId?: string) {
    const where: any = { id };
    if (userId) where.userId = userId; // user passed - own order only

    const order = await this.ordersRepo.findOne({
      where,
      relations: { items: { product: true }, user: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  // ----- ADMIN: ALL ORDERS (with user info for admin table) -----
  findAll() {
    return this.ordersRepo.find({
      order: { createdAt: 'DESC' },
      relations: { user: true, items: true },
    });
  }

  // ----- ADMIN: UPDATE STATUS -----
  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOne(id);

    // Prevent invalid transitions
    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException(
        'Cannot change status of a delivered order',
      );
    }

    // Special handling for cancellation - restore stock
    if (
      status === OrderStatus.CANCELLED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      await this.restoreStock(order);
    }

    // Auto-update payment status when delivered (COD case)
    if (
      status === OrderStatus.DELIVERED &&
      order.paymentStatus === PaymentStatus.PENDING
    ) {
      order.paymentStatus = PaymentStatus.PAID;
    }

    order.status = status;
    return this.ordersRepo.save(order);
  }

  // ----- CUSTOMER: CANCEL OWN ORDER -----
  async cancelOrder(id: string, userId: string) {
    const order = await this.findOne(id, userId);

    // Only allow cancel if pending or paid (not yet shipped)
    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.PAID
    ) {
      throw new BadRequestException(
        `Cannot cancel order with status: ${order.status}`,
      );
    }

    // Restore stock
    await this.restoreStock(order);

    order.status = OrderStatus.CANCELLED;
    return this.ordersRepo.save(order);
  }

  // ----- HELPER: RESTORE STOCK when order cancelled -----
  private async restoreStock(order: Order) {
    if (!order.items || order.items.length === 0) return;

    for (const item of order.items) {
      const product = await this.productsRepo.findOne({
        where: { id: item.productId },
      });
      if (product) {
        product.stock += item.quantity;
        await this.productsRepo.save(product);
      }
    }
  }

  // ----- PAYMENT CALLBACK (used later) -----
  async markPaid(id: string, transactionId: string) {
    const order = await this.findOne(id);
    order.paymentStatus = PaymentStatus.PAID;
    order.paymentTransactionId = transactionId;
    order.status = OrderStatus.PROCESSING;
    return this.ordersRepo.save(order);
  }
}