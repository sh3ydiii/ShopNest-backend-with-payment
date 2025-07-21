import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PaymentService {
    constructor (private prisma: PrismaService) {}

    async updateOrder(paymentId) {
        const order = await this.prisma.order.findFirst({
            where: {
                orderId: paymentId
            }
        })

        if (!order) throw new BadRequestException('Заказ не найден')

        await this.prisma.order.update({
            where: {
                orderId: paymentId
            },
            data: {
                status: "PAID"
            }
        })

        return {
            status: 'Success'
        }
    }
}
