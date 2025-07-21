import { BadGatewayException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async getProfile(data) {
        const userProfile = await this.prismaService.user.findFirst({
            where: {
                id: data
            }
        })

        if (!userProfile) throw new BadGatewayException('Профиль не найден!')

        return userProfile
    }

    async updateProfile(updateData, userdata) {
        const updateProfile = await this.prismaService.user.update({
            where: {
                phone: userdata.phone
            },
            data: { 
                name: updateData.name,
                dob: updateData.dob,
                sity: updateData.sity
            }
        })

        return updateProfile
    }
}
