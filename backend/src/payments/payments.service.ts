import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../orders/entities/order.entity';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const SSLCommerzPayment = require('sslcommerz-lts');

@Injectable()
export class PaymentsService {
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly isLive: boolean;
  private readonly frontendUrl: string;
  private readonly backendUrl: string;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
  ) {
    this.storeId = this.config.get<string>('SSLCOMMERZ_STORE_ID') || '';
    this.storePassword =
      this.config.get<string>('SSLCOMMERZ_STORE_PASSWORD') || '';
    this.isLive = this.config.get<string>('SSLCOMMERZ_IS_LIVE') === 'true';
    this.frontendUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    this.backendUrl =
      this.config.get<string>('BACKEND_URL') || 'http://localhost:4000';
  }

  // ----- INITIATE PAYMENT -----
  async initiatePayment(orderId: string, userId: string) {
    // Get order
    const order = await this.ordersRepo.findOne({
      where: { id: orderId, userId },
      relations: { items: true, user: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Order is already paid');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot pay for a cancelled order');
    }

    // SSLCommerz transaction data
    const data = {
      total_amount: Number(order.total),
      currency: 'BDT',
      tran_id: `${order.orderNumber}-${Date.now()}`, // unique per attempt
      success_url: `${this.backendUrl}/api/payments/success`,
      fail_url: `${this.backendUrl}/api/payments/fail`,
      cancel_url: `${this.backendUrl}/api/payments/cancel`,
      ipn_url: `${this.backendUrl}/api/payments/ipn`,

      // Order info
      shipping_method: 'Courier',
      product_name: order.items.map((i) => i.productName).join(', ').slice(0, 100),
      product_category: 'General',
      product_profile: 'general',

      // Customer info
      cus_name: order.user?.name || 'Customer',
      cus_email: order.user?.email || 'customer@mykart.com',
      cus_add1: order.shippingAddress,
      cus_city: 'Dhaka',
      cus_postcode: '1205',
      cus_country: 'Bangladesh',
      cus_phone: order.shippingPhone || '01700000000',

      // Shipping info
      ship_name: order.user?.name || 'Customer',
      ship_add1: order.shippingAddress,
      ship_city: 'Dhaka',
      ship_postcode: '1205',
      ship_country: 'Bangladesh',

      // Pass order ID for later identification
      value_a: order.id,
      value_b: order.orderNumber,
    };

    const sslcz = new SSLCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive,
    );

    const response = await sslcz.init(data);

    if (response.status !== 'SUCCESS') {
      throw new BadRequestException(
        response.failedreason || 'Failed to initiate payment',
      );
    }

    // Save transaction ID to order for tracking
    order.paymentTransactionId = data.tran_id;
    await this.ordersRepo.save(order);

    return {
      paymentUrl: response.GatewayPageURL,
      transactionId: data.tran_id,
    };
  }

  // ----- HANDLE SUCCESS -----
  async handleSuccess(body: any) {
    const orderId = body.value_a;
    const transactionId = body.tran_id;

    if (!orderId) {
      return { success: false, message: 'Invalid callback' };
    }

    const order = await this.ordersRepo.findOne({ where: { id: orderId } });
    if (!order) {
      return { success: false, message: 'Order not found' };
    }

    // Verify payment with SSLCommerz
    const sslcz = new SSLCommerzPayment(
      this.storeId,
      this.storePassword,
      this.isLive,
    );
    const validation = await sslcz.validate({ val_id: body.val_id });

    if (validation.status !== 'VALID' && validation.status !== 'VALIDATED') {
      order.paymentStatus = PaymentStatus.FAILED;
      await this.ordersRepo.save(order);
      return { success: false, message: 'Payment validation failed' };
    }

    // Mark paid
    order.paymentStatus = PaymentStatus.PAID;
    order.paymentTransactionId = transactionId;
    order.status = OrderStatus.PAID;
    await this.ordersRepo.save(order);

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  }

  // ----- HANDLE FAIL -----
  async handleFail(body: any) {
    const orderId = body.value_a;
    if (orderId) {
      const order = await this.ordersRepo.findOne({ where: { id: orderId } });
      if (order) {
        order.paymentStatus = PaymentStatus.FAILED;
        await this.ordersRepo.save(order);
      }
    }
    return { success: false, orderId, reason: body.failedreason };
  }

  // ----- HANDLE CANCEL -----
  async handleCancel(body: any) {
    const orderId = body.value_a;
    return { cancelled: true, orderId };
  }
}