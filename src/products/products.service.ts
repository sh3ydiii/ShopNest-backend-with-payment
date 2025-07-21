import { BadGatewayException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prismaService: PrismaService) {}

    async getAllProducts() {
        const products = await this.prismaService.product.findMany({
            include: {
                rates: true
            }
        })
        return products
    }

    async getProductById(id: number) {
        const product = await this.prismaService.product.findFirst({
            where: {
                id: id
            },
            include: {
                rates: true
            }
        })

        if (!product) throw new BadGatewayException('Продукт не найден.')

        return product
    }

    async addRate(id, data, userId) {
        const rate = await this.prismaService.rate.create({
            data: {
                productId: id,
                userId: userId,
                comment: data.comment,
                value: data.value
            }
        })

        return rate
    }

    async getAllRates(id: number) {
        const rates = await this.prismaService.rate.findMany({
            where: {
                productId: id
            }
        })

        return rates
    }

    async getTopMonthlyProducts() {
        const allProducts = await this.prismaService.product.findMany({
            include: {
              orderItems: {
                select: {
                  quantity: true,
                },
              },
            },
          });
          
          const ranked = allProducts.map(product => {
            const totalSold = product.orderItems.reduce((sum, oi) => sum + oi.quantity, 0);
            return {
              id: product.id,
              name: product.name,
              totalSold,
            };
          });
          
        ranked.sort((a, b) => b.totalSold - a.totalSold);
          
        const topProducts = ranked.slice(0, 5); // топ-5
          
        return topProducts
    }
}
