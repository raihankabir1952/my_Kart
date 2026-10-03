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
  ) { }

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

    if (userId) {
      where.userId = userId;
    }

    const order = await this.ordersRepo.findOne({
      where,
      relations: { items: { product: true }, user: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // ----- ADMIN: ALL ORDERS -----
  findAll() {
    return this.ordersRepo.find({
      order: { createdAt: 'DESC' },
      relations: { user: true, items: true },
    });
  }

  // ----- ADMIN: UPDATE STATUS -----

// ----- ADMIN: UPDATE STATUS -----
async updateStatus(id: string, status: OrderStatus) {
  const order = await this.findOne(id);

  // Same status: nothing to change
  if (order.status === status) {
    return order;
  }

  // Allowed status transitions
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [
      OrderStatus.PAID,
      OrderStatus.CANCELLED,
    ],

    [OrderStatus.PAID]: [
      OrderStatus.PROCESSING,
      OrderStatus.CANCELLED,
    ],

    [OrderStatus.PROCESSING]: [
      OrderStatus.SHIPPED,
    ],

    [OrderStatus.SHIPPED]: [
      OrderStatus.DELIVERED,
    ],

    [OrderStatus.DELIVERED]: [],

    [OrderStatus.CANCELLED]: [],
  };

  const allowedNextStatuses = allowedTransitions[order.status];

  if (!allowedNextStatuses.includes(status)) {
    throw new BadRequestException(
      `Cannot change order status from ${order.status} to ${status}`,
    );
  }

  // Restore stock when order is cancelled
  if (status === OrderStatus.CANCELLED) {
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

    // Only allow cancel if pending or paid
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

  // ----- HELPER: RESTORE STOCK -----
  private async restoreStock(order: Order) {
    if (!order.items || order.items.length === 0) {
      return;
    }

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

  // ----- PAYMENT CALLBACK -----
  async markPaid(id: string, transactionId: string) {
    const order = await this.findOne(id);

    order.paymentStatus = PaymentStatus.PAID;
    order.paymentTransactionId = transactionId;
    order.status = OrderStatus.PROCESSING;

    return this.ordersRepo.save(order);
  }

  // ----- ADMIN: ANALYTICS -----
  async getAnalytics() {
    const orders = await this.ordersRepo.find({
      relations: { items: true },
      order: { createdAt: 'ASC' },
    });

    const totalOrders = orders.length;

    const paidOrders = orders.filter(
      (order) => order.paymentStatus === PaymentStatus.PAID,
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.status === OrderStatus.CANCELLED,
    ).length;

    const totalRevenue = orders
      .filter((order) => order.paymentStatus === PaymentStatus.PAID)
      .reduce((sum, order) => sum + Number(order.total), 0);

    const statusBreakdown = {
      pending: orders.filter(
        (order) => order.status === OrderStatus.PENDING,
      ).length,


paid: orders.filter(
  (order) => order.status === OrderStatus.PAID,
).length,

processing: orders.filter(
  (order) => order.status === OrderStatus.PROCESSING,
).length,

shipped: orders.filter(
  (order) => order.status === OrderStatus.SHIPPED,
).length,

delivered: orders.filter(
  (order) => order.status === OrderStatus.DELIVERED,
).length,

cancelled: cancelledOrders,


  };

  // Revenue grouped by date
  const revenueByDateMap: Record<string, number> = {};

  for(const order of orders) {
    if (order.paymentStatus !== PaymentStatus.PAID) {
      continue;
    }

    
const date = new Date(order.createdAt)
  .toISOString()
  .split('T')[0];

revenueByDateMap[date] =
  (revenueByDateMap[date] || 0) + Number(order.total);


  }

  const revenueByDate = Object.entries(revenueByDateMap).map(
    ([date, revenue]) => ({
      date,
      revenue,
    }),
  );

  // Top selling products
  const productSalesMap: Record<
    string,
    {
      productId: string;
      productName: string;
      quantity: number;
      revenue: number;
    }

  > = {};

  for(const order of orders) {
    // Only count paid orders
    if (order.paymentStatus !== PaymentStatus.PAID) {
      continue;
    }

    
for (const item of order.items) {
  if (!productSalesMap[item.productId]) {
    productSalesMap[item.productId] = {
      productId: item.productId,
      productName: item.productName,
      quantity: 0,
      revenue: 0,
    };
  }

  productSalesMap[item.productId].quantity += item.quantity;

  productSalesMap[item.productId].revenue +=
    Number(item.subtotal);
}


  }

  const topSellingProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

return {
  totalOrders,
  paidOrders,
  cancelledOrders,
  totalRevenue,
  statusBreakdown,
  revenueByDate,
  topSellingProducts,
};
}

}