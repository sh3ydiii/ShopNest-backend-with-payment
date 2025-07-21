import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private readonly prismaService: PrismaService) {}

    async getUserCart(userId: number) {
        return this.prismaService.cartItem.findMany({
          where: { userId },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
              },
            },
          },
        });
    }

    async addProductToOrder(productId: number, userId, quantity = 1) {
        const result = await this.prismaService.cartItem.upsert({
            where: {
                userId_productId: { userId, productId }, 
              },
              update: {
                quantity: { increment: quantity },
              },
              create: {
                userId,
                productId,
                quantity,
              },
            });
        

        return result
    }

    async removeProduct(productId: number, userId: number) {
        const cartItem = await this.prismaService.cartItem.findUnique({
          where: {
            userId_productId: { userId, productId },
          },
        });
      
        if (!cartItem) {
          throw new Error('Товар не найден в корзине');
        }
      
        if (cartItem.quantity > 1) {
          return this.prismaService.cartItem.update({
            where: {
              userId_productId: { userId, productId },
            },
            data: {
              quantity: { decrement: 1 },
            },
          });
        } else {
          return this.prismaService.cartItem.delete({
            where: {
              userId_productId: { userId, productId },
            },
          });
        }
      }

}

