import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prismaService: PrismaService) {}

    async home() {
        const [orderCount, totalRevenue, userCount, todayOrders] = await Promise.all([
            this.prismaService.order.count(),
            this.prismaService.order.aggregate({
                _sum: {
                    sumProducts: true
                }
            }),
            this.prismaService.user.count(),
            this.prismaService.order.count({
                where: {
                    addedAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            })
        ])

        return {
            orderCount,
            totalRevenue: totalRevenue._sum.sumProducts || 0,
            userCount,
            todayOrders,
        };
    }

    async getAllUsers() {
        const users = await this.prismaService.user.findMany()

        return users
    }

    async getUserById(id) {
        const user = await this.prismaService.user.findFirst({
            where: {
                id: id
            }
        })

        if (!user) throw new BadGatewayException('Пользователь не найден.')

        return user
    }

    async getAllProducts() {
        const products = await this.prismaService.product.findMany()

        return products
    }

    async getProductById(id: number) {
        const product = await this.prismaService.product.findFirst({
            where: {
                id: id
            }
        })

        if (!product) throw new BadGatewayException('Продукт не найден.')

        return product
    }

    async createProduct(data) {
        const product = await this.prismaService.product.create({
            data
        })

        return product
    }

    async getCategories() {
        const categories = await this.prismaService.categories.findMany({
            include: {
                products: true, // или product если имя связи другое
            },
        })

        return categories
    }

    async addCategories(data) {
        const categories = await this.prismaService.categories.create({
            data
        })

        return categories
    }

    async confirmOrder(id, data) {
        console.log(data)
        return await this.prismaService.order.update({
            where: {
                id
            },
            data: {
                status: data.status
            }
        })
    }

    async getAllOrders() {
        return await this.prismaService.order.findMany()
    }

    async deleteUser(id) {
        const result = await this.prismaService.user.findFirst({
            where: {
                id
            }
        })

        if (!result) throw new BadRequestException('Пользователь не найден')

        await this.prismaService.user.delete({
            where: {
                id
            }
        })

        return {
            message: 'success'
        }
    }

    async updateProduct(id, data) {
        const product = await this.prismaService.product.findFirst({
            where: {
                id
            }
        })

        if (!product) throw new BadRequestException('Товар не найден')

        const updateProduct = await this.prismaService.product.update({
            where: {
                id
            },
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                categoriesId: data.categoriesId,
                imageUrl: data.imageUrl
            }
        })

        return updateProduct
    }

    async deleteProduct(id) {
        const product = await this.prismaService.product.findFirst({
            where: {
                id
            }
        })

        if (!product) throw new BadRequestException('Товар не найден')

        await this.prismaService.product.delete({
            where: {
                id
            }
        })

        return {
            message: "Success!"
        }
    }

    async updateCategories(id, data) {
        const categories = await this.prismaService.categories.findFirst({
            where: {
                id
            }
        })

        if (!categories) throw new BadRequestException('Категория не найдена')
        
        const updateCategories = await this.prismaService.categories.update({
            where: {
                id
            },
            data: {
                name: data.name
            }
        })

        return updateCategories
    }

    async deleteCategories(id) {
        const categories = await this.prismaService.categories.findFirst({
            where: {
                id
            }
        })

        if (!categories) throw new BadRequestException('Категория не найдена')

        await this.prismaService.categories.delete({
            where: {
                id
            }
        })

        return {
            message: "Success!"
        }
    }
}
