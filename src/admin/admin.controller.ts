import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from 'src/guard/role.guard';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { Roles } from 'src/guard/roles.decorator';
import { CreateProductDto } from './dto/product.create.dto';
import { CreateCategoriesDto, UpdateCategoriesDto } from './dto/categories.create.dto';
import { updateProductDto } from './dto/update.product.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('home')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Главная страница админа' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает информацию для главной страницы админа',
    schema: {
      example: {
        "orderCount": 1,
        "totalRevenue": 10467,
        "userCount": 3,
        "todayOrders": 0
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async home() {
    const home = await this.adminService.home()

    return home
  }


  @Get('users')
  @Roles('ADMIN') 
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает список всех пользователей',
    schema: {
      example: {
        "users": [
            {
                "id": 1,
                "phone": "+79293457685",
                "password": "$2b$10$1zLiFiG/ObokV9oEk2US3OpfynmSHpJSE/n6ss643oeeQV94ez/uG",
                "name": "Malina",
                "role": "USER",
                "lvl": 0,
                "xp": 0,
                "addedAt": "2025-06-30T19:01:04.678Z",
                "dob": "2005-09-26T00:00:00.000Z",
                "sity": "Moscow",
                "totalSpent": "0"
            },
        ]
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUsers() {
    const users = await this.adminService.getAllUsers()

    return {
      users: users
    }
  }

  @Get('user/:id')
  @Roles('ADMIN')
  @ApiParam({ name: 'id', description: 'ID пользователя' }) 
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает информацию о пользователе по ID',
    schema: {
      example: {
          "id": 1,
          "phone": "+79293457685",
          "password": "$2b$10$1zLiFiG/ObokV9oEk2US3OpfynmSHpJSE/n6ss643oeeQV94ez/uG",
          "name": "Malina",
          "role": "USER",
          "lvl": 0,
          "xp": 0,
          "addedAt": "2025-06-30T19:01:04.678Z",
          "dob": "2005-09-26T00:00:00.000Z",
          "sity": "Moscow",
          "totalSpent": "0"
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.adminService.getUserById(id)

    return {
      user: user
    }
  }

  @Get('products')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Получить все товары' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает список всех товаров',
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
          }
      ]
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllProducts() {
    const products = await this.adminService.getAllProducts()

    return {
      products: products
    }
  }

  @Get('products/:id')
  @Roles('ADMIN')
  @ApiParam({ name: 'id', description: 'ID товара' }) 
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает информацию о пользователе по ID',
    schema: {
      example: {
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
  })
  @UseGuards(JwtAuthGuard,RolesGuard)
  async getProductsById(@Param('id', ParseIntPipe) id: number) {
    const product = await this.adminService.getProductById(id)

    return {
      product: product 
    }
  }

  @Post('products/add')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Создать новый товар' })
  @ApiResponse({
    status: 200,
    description: 'Добавляет новый товар',
    schema: {
      example: {
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
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addProduct(@Body() createProductDTO: CreateProductDto) {
    const product = await this.adminService.createProduct(createProductDTO)

    return {
      product
    }
  }

  @Get('categories')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Получить категории' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает все категории',
    schema: {
      example: [ {
        "id": 1,
        "name": "Обувь"
      }, 
      {
        "id": 2,
        "name": "Верхняя одежда"
      }
      ]
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getCategories() {
    const categories = await this.adminService.getCategories()

    return {
      categories: categories
    }
  }

  @Post('categories/add')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Добавить категории' })
  @ApiResponse({
    status: 200,
    description: 'Добавить категорию',
    schema: {
      example: {
        "id": 1,
        "name": "Обувь"
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async addCategories(@Body() data: CreateCategoriesDto) {
    const categories = await this.adminService.addCategories(data)

    return {
      categories
    }
  }

  @Post('order/:id/confirm')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Подтвердить заказ' })
  @ApiResponse({
    status: 200,
    description: 'Данные подтвержденного заказа',
    schema: {
      example: {
          "id": 1,
          "orderId": "2ffcd9ad-000f-5001-8000-1b7c491559c2",
          "userId": 2,
          "sumProducts": 10467,
          "status": "PENDING",
          "addedAt": "2025-07-06T18:52:29.772Z",
          "updateAt": "2025-07-06T18:52:29.772Z",
          "address": "Moscow, Tverskaya 1"
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async confirmOrder(@Param('id', ParseIntPipe) id: number, @Body() status: string) {
    const order = await this.adminService.confirmOrder(id, status)

    return {
      order: order
    }
  }

  @Get('orders')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Получить заказы' })
  @ApiResponse({
    status: 200,
    description: 'Данные всех заказов',
    schema: {
      example: [{
          "id": 1,
          "orderId": "2ffcd9ad-000f-5001-8000-1b7c491559c2",
          "userId": 2,
          "sumProducts": 10467,
          "status": "PENDING",
          "addedAt": "2025-07-06T18:52:29.772Z",
          "updateAt": "2025-07-06T18:52:29.772Z",
          "address": "Moscow, Tverskaya 1"
      },
      {
        "id": 2,
        "orderId": "2ffcd9ad-0ewef-5001-8000-1b7c491559c2",
        "userId": 1,
        "sumProducts": 1034,
        "status": "ACCEPTED",
        "addedAt": "2025-07-06T18:52:29.772Z",
        "updateAt": "2025-05-06T18:52:29.772Z",
        "address": "Moscow, Tverskaya 2"
    }
    ]
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllOrders() {
    const orders = await this.adminService.getAllOrders()

    return {
      orders: orders
    }
  }

  @Delete('users/:id')
  @Roles('ADMIN')
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает сообщение об успешном удалении пользователя',
    schema: {
      example: {
        message: "Пользователь удален!"
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteUsers(@Param('id', ParseIntPipe) id: number) {
    const result = await this.adminService.deleteUser(id)

    return result
  }

  @Patch('products/:id')
  @Roles('ADMIN')
  @ApiParam({ name: 'id', description: 'ID товара' })
  @ApiOperation({ summary: 'Обновить товар по ID' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает данные обновленного товара!',
    schema: {
      example: {
        "products": [
          {
              "id": 1,
              "name": "Nike Air Jordan 5",
              "description": "Модные кроссовки",
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
      ]
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateProductsInfo(@Param('id', ParseIntPipe) id: number, @Body() data: updateProductDto) {
    const updateProduct = await this.adminService.updateProduct(id, data)

    return {
      product: updateProduct
    }
  }

  @Delete('products/:id')
  @Roles('ADMIN')
  @ApiParam({ name: 'id', description: 'ID товара' })
  @ApiOperation({ summary: 'Удалить товара по ID' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает сообщение об успешном удалении товара',
    schema: {
      example: {
        message: "Товар удален!"
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteProducts(@Param('id', ParseIntPipe) id: number) {
    const data = await this.adminService.deleteProduct(id) 

    return data
  }

  @Delete('categories/:id')
  @Roles('ADMIN')
  @ApiParam({ name: 'id', description: 'ID категории' })
  @ApiOperation({ summary: 'Удалить категорию по ID' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает сообщение об успешном удалении категории',
    schema: {
      example: {
        message: "Категория удалена!"
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteCategories(@Param('id', ParseIntPipe) id: number) {
    const data = await this.adminService.deleteCategories(id) 

    return data
  }

  @Patch('categories/:id')
  @Roles('ADMIN')
  @ApiParam({ name: 'id', description: 'ID категории' })
  @ApiOperation({ summary: 'Обновить категорию' })
  @ApiResponse({
    status: 200,
    description: 'Данные обновленной категории категорию',
    schema: {
      example: {
        "id": 1,
        "name": "Шорты"
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateCategoriesInfo(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCategoriesDto) {
    const updateCategories = await this.adminService.updateCategories(id, data)

    return {
      categories: updateCategories
    }
  }
}
