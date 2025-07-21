import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

interface AuthenticationRequest extends Request {
    user: {
        id: string,
        phone: string
    }
}
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('registration') 
    @ApiOperation({ summary: 'Регистрация аккаунта' })
    @ApiResponse({
    status: 200,
    description: 'Сообщение об успешной регистрации',
    schema: {
        example: {
            message: 'Вы успешно зарегистрированы!'
        }
    }
    })
    async register(@Body() RegisterData: CreateUserDto) {
        console.log(RegisterData)
        const result = await this.authService.register(RegisterData)
        return result
    }

    @Post('login')
    @ApiOperation({ summary: 'Зайти в аккаунт' })
    @ApiResponse({
    status: 200,
    description: 'Токен авторизации',
    schema: {
        example: {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicGhvbmUiOiIrNzkwNDI1MDIwMDUiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1MzEyNTM2NywiZXhwIjoxNzUzMTI4OTY3fQ.kfkBjyykhY-dmKvd_POkwetuSUwREmg4r8iScmbvXQw"        }
    }
    })
    async login(@Body() LoginData: LoginDto, @Res({ passthrough: true}) res: Response){
        const tokens = await this.authService.login(LoginData)

        res.cookie('refreshToken',tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        console.log(LoginData)
        return {
            accessToken: tokens.accessToken
        }
    }

    @Post('logout')
    @ApiOperation({ summary: 'Выйти из аккаунта' })
    @ApiResponse({
    status: 200,
    description: 'Уведомление об успешном выходе из аккаунта',
    schema: {
        example: {
            message: 'Вы успешно вышли с аккаунта'
        }
    }
    })
    @UseGuards(JwtAuthGuard)
    async logout(@Res() res: Response, @Req() req: Request) {
        await this.authService.logout(req.cookies['refreshToken'])
        res.clearCookie('refreshToken')
        return res.json({
            message: 'Вы успешно вышли с аккаунта'
        })
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Обновить токен авторизации' })
    @ApiResponse({
    status: 200,
    description: 'Токен авторизации',
    schema: {
        example: {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicGhvbmUiOiIrNzkwNDI1MDIwMDUiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1MzEyNTM2NywiZXhwIjoxNzUzMTI4OTY3fQ.kfkBjyykhY-dmKvd_POkwetuSUwREmg4r8iScmbvXQw"        }
    }
    })
    async refresh(@Req() req: Request) {
        const accessToken = await this.authService.refresh(req.cookies['refreshToken'])
        return {
            accessToken: accessToken
        }
    }
}
