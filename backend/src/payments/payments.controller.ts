import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly config: ConfigService,
  ) {}

  // Customer initiates payment for an order
  @UseGuards(JwtAuthGuard)
  @Post('initiate/:orderId')
  initiate(@Param('orderId') orderId: string, @Req() req: any) {
    return this.paymentsService.initiatePayment(orderId, req.user.id);
  }

  // SSLCommerz callbacks (no auth - public)
  @Post('success')
  async success(@Body() body: any, @Res() res: Response) {
    const result = await this.paymentsService.handleSuccess(body);
    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    if (result.success) {
      return res.redirect(
        `${frontendUrl}/payment/success?orderId=${result.orderId}`,
      );
    }
    return res.redirect(`${frontendUrl}/payment/fail`);
  }

  @Post('fail')
  async fail(@Body() body: any, @Res() res: Response) {
    await this.paymentsService.handleFail(body);
    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/payment/fail`);
  }

  @Post('cancel')
  async cancel(@Body() body: any, @Res() res: Response) {
    await this.paymentsService.handleCancel(body);
    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/payment/cancel`);
  }

  // IPN — server-to-server notification (no redirect)
  @Post('ipn')
  async ipn(@Body() body: any) {
    return this.paymentsService.handleSuccess(body);
  }
}