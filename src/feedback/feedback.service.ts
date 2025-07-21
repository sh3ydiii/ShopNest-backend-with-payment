import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FeedbackService {
    constructor (private prisma: PrismaService) {}

    async getFeedbacks() {
        return await this.prisma.feedback.findMany()
    }

    async createFeedback(userId, data) {
        const feedbackCreate = await this.prisma.feedback.create({
            data: {
                userId: userId,
                message: data.message,
                email: data.email
            }
        })

        return feedbackCreate
    }

    async updateFeedback(id, status) {
        const UpdateFeedback = await this.prisma.feedback.update({
            where: {
                id
            },
            data: {
                status
            }
        })

        return UpdateFeedback
    }
}
