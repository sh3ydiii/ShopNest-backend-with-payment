import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  private readonly shopId = process.env.YOOKASSA_SHOP_ID
  private readonly secretKey = process.env.YOOKASSA_SECRET_KEY
  constructor(private readonly paymentService: PaymentService) {}

  @Post('success')
  @HttpCode(200)
  async handleWebhook(@Body() body: any, @Headers('authorization') authHeader: string) {
    console.log('Webhook received:', body);

    if (body.event === 'payment.succeeded') {
      const paymentId = body.object.id;

      return await this.paymentService.updateOrder(paymentId)
    }

    return { status: 'ok' };
  }

}
