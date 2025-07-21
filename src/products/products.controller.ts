import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddRateDto } from './dto/add.rate.dto';

interface ProductsRequest extends Request {
  user: {
      userId: string,
      phone: string,
      role: string
  }
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все продукты' })
  @ApiResponse({
  status: 200,
  description: 'Все продукты',
  schema: {
      example: {
        "products": [
          {
              "id": 1,
              "name": "Nike Air Jordan 5",
              "description": "Модные стильные кроссвки",
              "price": 3489,
              "brand": "Nike",
              "type": "Кроссовки",
              "colors": [
                  "black",
                  "white"
              ],
              "sizes": [
                  36,
                  37,
                  38,
                  39
              ],
              "categoriesId": null,
              "imageUrl": null,
              "isExclusive": false,
              "rates": []
          },
          {
              "id": 2,
              "name": "Nike Air Jordan 1",
              "description": "Модные стильные кроссвки",
              "price": 2587,
              "brand": "Nike",
              "type": "Кроссовки",
              "colors": [
                  "red",
                  "yellow"
              ],
              "sizes": [
                  36,
                  37,
                  38,
                  39
              ],
              "categoriesId": null,
              "imageUrl": null,
              "isExclusive": false,
              "rates": []
          }
      ]
      }
  }
  })
  async getProducts() {
    const products = await this.productsService.getAllProducts()

    return {
      products
    }
  }


  @Get('top-monthly')
  @ApiOperation({ summary: 'Получить топ продуктов по продажам' })
  @ApiResponse({
  status: 200,
  description: 'Топ товаров сайта',
  schema: {
      example: {
        "products": [
          {
              "id": 1,
              "name": "Nike Air Jordan 5",
              "totalSold": 4
          },
          {
              "id": 2,
              "name": "Nike Air Jordan 1",
              "totalSold": 0
          }
      ]
      }
  }
  })
  async getTopMonthlyProducts() {
    const topProducts = await this.productsService.getTopMonthlyProducts()
    return {
      products: topProducts
    }
  }


  @Get(':id')
  @ApiOperation({ summary: 'Получить продукт по ID' })
  @ApiResponse({
  status: 200,
  description: 'Данные товара',
  schema: {
      example: {
        "products": {
          "id": 1,
          "name": "Nike Air Jordan 5",
          "description": "Модные стильные кроссвки",
          "price": 3489,
          "brand": "Nike",
          "type": "Кроссовки",
          "colors": [
              "black",
              "white"
          ],
          "sizes": [
              36,
              37,
              38,
              39
          ],
          "categoriesId": null,
          "imageUrl": null,
          "isExclusive": false,
          "rates": []
      }
      }
  }
  })
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.getProductById(id)

    return {
      products: product
    }
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Оставить отзыв продукту по ID' })
  @ApiResponse({
  status: 200,
  description: 'Отзыв товара',
  schema: {
      example: {
        "rate": {
          "id": 1,
          "userId": 2,
          "productId": 1,
          "value": 4,
          "comment": "Классные",
          "addedAt": "2025-07-21T19:48:56.536Z"
      }
      }
  }
  })
  @ApiBody({
    description: 'Данные для добавления отзыва',
    type: AddRateDto,
    examples: {
      example1: {
        value: {
          value: 4,
          comment: 'Классные'
        }
      }
    }
  })
  @UseGuards(JwtAuthGuard)
  async addRateForProduct(@Param('id', ParseIntPipe) id: number, @Body() addRate: AddRateDto, @Req() req: ProductsRequest) {
    console.log(req.user)
    const rate = await this.productsService.addRate(id, addRate, req.user.userId)
    return {
      rate: rate
    }
  }

  @Get(':id/rates')
  @ApiOperation({ summary: 'Получить отзывы продукта по ID' })
  @ApiResponse({
  status: 200,
  description: 'Отзывы товара',
  schema: {
      example: {
        "rates": [
          {
              "id": 1,
              "userId": 2,
              "productId": 1,
              "value": 4,
              "comment": "Классные",
              "addedAt": "2025-07-21T19:48:56.536Z"
          }
      ]
      }
  }
  })
  async getAllRates(@Param('id', ParseIntPipe) id: number) {
    const rates = await this.productsService.getAllRates(id)
    return {
      rates: rates
    }
  }

}
