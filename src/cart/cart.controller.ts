import { BadGatewayException, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

interface UserRequest extends Request{ 
  user: {
    userId: number,
    phone: string,
    role: string
  }
}
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Получение корзины' })
  @ApiResponse({
  status: 200,
  description: 'Товары из коризны',
  schema: {
      example: {
        "cart": [
          {
              "id": 4,
              "userId": 5,
              "productId": 1,
              "quantity": 1,
              "createdAt": "2025-07-21T19:22:26.105Z",
              "product": {
                  "id": 1,
                  "name": "Nike Air Jordan 5",
                  "price": 3489,
                  "imageUrl": null
              }
          }
      ]
      }
  }
  })
  @UseGuards(JwtAuthGuard)
  async getUserCart(@Req() req: UserRequest) {
    const cart = await this.cartService.getUserCart(req.user.userId)

    if (cart.length == 0) return {
      message: 'Корзина пуста.'
    }

    return {
      cart: cart
    }
  }

  @Post(':id/add')
  @ApiParam({ name: 'id', description: 'ID товара для добавления в корзину', type: Number })
  @ApiOperation({ summary: 'Добавление товара в корзину' })
  @ApiResponse({
  status: 200,
  description: 'Товар из корзины',
  schema: {
      example: {
        "result": {
        "id": 6,
        "userId": 5,
        "productId": 2,
        "quantity": 2,
        "createdAt": "2025-07-21T19:23:02.012Z"
    }
      }
  }
  })
  @UseGuards(JwtAuthGuard)
  async addProductToOrder(@Param('id', ParseIntPipe) id: number, @Req() req: UserRequest) {
    const resultAdd = await this.cartService.addProductToOrder(id, req.user.userId)

    return {
      result: resultAdd
    }
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID товара для удаления из корзины', type: Number })
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiResponse({
  status: 200,
  description: 'Сообщение о удалении товара и коризна пользователя',
  schema: {
      example: {
        "message": "Товар удалён",
        "cart": [
            {
                "id": 4,
                "userId": 5,
                "productId": 1,
                "quantity": 2,
                "createdAt": "2025-07-21T19:22:26.105Z",
                "product": {
                    "id": 1,
                    "name": "Nike Air Jordan 5",
                    "price": 3489,
                    "imageUrl": null
                }
            },
            {
                "id": 6,
                "userId": 5,
                "productId": 2,
                "quantity": 2,
                "createdAt": "2025-07-21T19:23:02.012Z",
                "product": {
                    "id": 2,
                    "name": "Nike Air Jordan 1",
                    "price": 2587,
                    "imageUrl": null
                }
            }
        ]
    }
  }
  })
  @UseGuards(JwtAuthGuard)
  async removeProductToOrder(@Param('id', ParseIntPipe) id: number, @Req() req: UserRequest) {
    await this.cartService.removeProduct(id, req.user.userId)

    const updatedCart = await this.cartService.getUserCart(req.user.userId);
    return {
      message: 'Товар удалён',
      cart: updatedCart
    }
  }
}
