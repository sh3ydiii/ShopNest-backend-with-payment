import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
    private readonly shopId = process.env.YOOKASSA_SHOP_ID
    private readonly secretKey = process.env.YOOKASSA_SECRET_KEY
    constructor( private prismaService: PrismaService ) {}


    async createOrder(userId: number, address: string) {
        const idempotenceKey = uuidv4();
        // Получаем корзину
        const cartItems = await this.prismaService.cartItem.findMany({
          where: { userId },
          include: { product: true },
        });
      
        if (cartItems.length === 0) {
          throw new BadRequestException('Корзина пуста. Добавьте товары в корзину перед оформлением заказа.');
        }
      
        // Подсчёт суммы
        const sum = cartItems.reduce((total, item) => {
          return total + item.product.price * item.quantity;
        }, 0);
    
            
        const paymentData = {
            amount: {
              value: sum.toFixed(2),
              currency: 'RUB',
            },
            confirmation: {
              type: 'redirect',
              return_url: `http://localhost:3000/orders`,
            },
            capture: true,
            description: `Оплата заказа`,
          };
      
      const res = await axios.post('https://api.yookassa.ru/v3/payments', paymentData, {
        headers: {
          'Idempotence-Key': idempotenceKey,
          'Content-Type': 'application/json',
          Authorization:
            'Basic ' + Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64'),
        },
      });

    await this.prismaService.order.create({
        data: {
            userId,
            orderId: res.data.id,
            sumProducts: sum,
            status: 'PENDING',
            items: {
                create: cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    priceAtPurchase: item.product.price,
            })),
            },
            address
        },
        include: {
            items: true,
        },
    });

    await this.prismaService.cartItem.deleteMany({
        where: { userId },
    })

        return res.data;
    }

    async getOrders(userId) {
        const orders = await this.prismaService.order.findMany({
            where: {
                userId: userId
            }
        })

        return orders
    }

    async getOrderById(id) {
        const order = await this.prismaService.order.findFirst({
            where: {
                id
            }
        })

        if (!order) throw new BadRequestException('Заказ не найден')

        return order
    }

    async canceledOrder(id, userId) {
        const order = await this.prismaService.order.findFirst({
            where: {
                id
            }
        })

        if (!order) throw new BadRequestException('Заказ не найден')

        if (order.status == 'DELIVERED') throw new BadRequestException('Заказ отменить нельзя.')

        await this.prismaService.order.update({
            where: {
                id
            },
            data: {
                status: 'CANCELED'
            }
        })

        const response = await axios.post(
            'https://api.yookassa.ru/v3/refunds',
            {
              payment_id: order.orderId,
              amount: {
                value: order.sumProducts,
                currency: 'RUB',
              },
              description: 'Отмена заказа',
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization:
                  'Basic ' +
                  Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64'),
                'Idempotence-Key': Date.now().toString(), // уникальный ключ для предотвращения дубликатов
              },
            },
          );

          return response.data
    }
}
