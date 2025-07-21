import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

interface UserRequest extends Request {
  user: {
    userId: number,
    phone: string,
    role: string
  }
}
@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Создать заказ' })
  @ApiResponse({
  status: 200,
  description: 'Ссылка на оплату',
  schema: {
      example: {
            "url": "https://yoomoney.ru/payment/shop-confirmation"
      }
  }
  })
  @ApiBody({
    description: 'Адрес доставки',
    type: String,
    examples: {
      examples1:  {
        value: {
          address: "г. Москва, ул. Ленина, д. 1"
      }
    }
    }
  })
  async placeOrder(@Req() req: UserRequest, @Body() data: { address: string}) {
    const order = await this.ordersService.createOrder(req.user.userId, data.address)

    return {
      url: order.confirmation.confirmation_url
    }
  }

  @Get()
  @ApiOperation({ summary: 'Получить заказы пользователя' })
  @ApiResponse({
  status: 200,
  description: 'Все заказы пользователя',
  schema: {
      example: {
        "orders": [
          {
              "id": 1,
              "orderId": "2ffcd9ad-000f-5001-8000-1b7c491559c2",
              "userId": 2,
              "sumProducts": 10467,
              "status": "PENDING",
              "addedAt": "2025-07-06T18:52:29.772Z",
              "updateAt": "2025-07-06T18:52:29.772Z",
              "address": "Москва, ул. Ленина, д. 1"
          },
          {
              "id": 2,
              "orderId": "3010aad5-000f-5000-b000-144bc01c89bf",
              "userId": 2,
              "sumProducts": 3489,
              "status": "PENDING",
              "addedAt": "2025-07-21T19:37:57.971Z",
              "updateAt": "2025-07-21T19:37:57.971Z",
              "address": "ddfdfdf"
          }
      ]
      }
  }
  })
  @UseGuards(JwtAuthGuard)
  async getOrders(@Req() req: UserRequest) {
    const orders = await this.ordersService.getOrders(req.user.userId)

    return {
      orders: orders
    }
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID заказа', type: Number })
  @ApiOperation({ summary: 'Получить заказ пользователя по ID' })
  @ApiResponse({
  status: 200,
  description: 'Все заказы пользователя',
  schema: {
      example: {
        "id": 1,
        "orderId": "2ffcd9ad-000f-5001-8000-1b7c491559c2",
        "userId": 2,
        "sumProducts": 10467,
        "status": "PENDING",
        "addedAt": "2025-07-06T18:52:29.772Z",
        "updateAt": "2025-07-06T18:52:29.772Z",
        "address": "Москва, ул. Ленина, д. 1"
      }
  }
  })
  @UseGuards(JwtAuthGuard)
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.getOrderById(id)

    return {
      order: order
    }
  }

  @Post(':id/canceled')
  @ApiParam({ name: 'id', description: 'ID заказа', type: Number })
  @ApiOperation({ summary: 'Отменить заказ пользователя по ID' })
  @ApiResponse({
  status: 200,
  description: 'Отменить заказы пользователя',
  schema: {
      example: {
            "id": "3010ac31-0015-5001-8000-14c38a3e5286",
            "payment_id": "2ffcd9ad-000f-5001-8000-1b7c491559c2",
            "status": "succeeded",
            "created_at": "2025-07-21T19:43:45.891Z",
            "amount": {
                "value": "10467.00",
                "currency": "RUB"
            },
            "description": "Отмена заказа"
      }
  }
  })
  @UseGuards(JwtAuthGuard)
  async canceledOrderById(@Param('id', ParseIntPipe) id: number, @Req() req: UserRequest) {
    const order = await this.ordersService.canceledOrder(id, req.user.userId)

    return order
  }
}
