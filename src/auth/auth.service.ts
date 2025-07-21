import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService,private jwtService: JwtService) {}

    async register(RegisterData) {
        const user = await this.prismaService.user.findFirst({
            where: {
                phone: RegisterData.phone
            }
        })

        if (user) throw new BadRequestException('Пользователь уже зарегистрирован!')
        
        const hashPassword = await bcrypt.hash(RegisterData.password, 10)
        await this.prismaService.user.create({
            data: {
                phone: RegisterData.phone,
                password: hashPassword,
                name: RegisterData.name,
                dob: new Date(RegisterData.dob),
                sity: RegisterData.sity
            }
        })

        return {
            message: 'Вы успешно зарегистрированы!'
        }
    }

    async login(data: {phone: string, password: string}) {
        const user = await this.prismaService.user.findFirst({
            where: {
                phone: data.phone
            }
        })
        console.log(user)
        if (!user) throw new BadRequestException('Пользователь не зарегистрирован!')

        const passwordPayload = await bcrypt.compare(data.password, user.password)
        if (!passwordPayload) throw new BadRequestException('Неверный пароль!')

        const payload = {
            id: user.id,
            phone: data.phone,
            role: user.role
        }
        const AccessToken = await this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_ACCESS,
            expiresIn: '1h'
        })
        const RefreshToken = await this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_REFRESH,
            expiresIn:'7d'        
        })

        await this.prismaService.refreshToken.create({
            data: {
                token: RefreshToken,
                userId: payload.id
            }
        })
        return {
            accessToken: AccessToken,
            refreshToken: RefreshToken
        }
    }

    async logout(token: string) {
        const tokens = await this.prismaService.refreshToken.findFirst({
            where: {
                token: token
            }
        })

        if (!tokens) return

        await this.prismaService.refreshToken.delete({
            where: {
                token: token
            }
        })

        return
    }

    async refresh(refreshToken: string) {
        const payload = await this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_SECRET_REFRESH
        })
        console.log(payload)
        if (!payload) throw new BadRequestException('Неверный токен!')

        const AccessToken = await this.jwtService.sign({
            id: payload.id,
            phone: payload.phone,
            role: payload.role
        }, {
            secret: process.env.JWT_SECRET_ACCESS,
            expiresIn: '1h'
        })

        return AccessToken
        
    }
}
