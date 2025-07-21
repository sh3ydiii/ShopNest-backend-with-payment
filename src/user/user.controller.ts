import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtAuthGuard } from 'src/guard/jwt.guard';
import { Response } from 'express';
import { Roles } from 'src/guard/roles.decorator';
import { RolesGuard } from 'src/guard/role.guard';
import { UpdateDto } from './dto/user.update.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

interface AuthenticationRequest extends Request {
    user: {
        userId: string,
        phone: string,
        role: string
    }
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private prismaService: PrismaService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить профиль пользователя' })
  @ApiResponse({
  status: 200,
  description: 'Данные профиля',
  schema: {
      example: {
        "user": {
          "id": 2,
          "phone": "+79042002000",
          "password": "$2b$10$D2yzRoFOqd/mTzvNsqqiueQxjPAyRm4tTn9QbJTqlXfvAN6xyWpI6",
          "name": "Egor",
          "role": "ADMIN",
          "lvl": 0,
          "xp": 0,
          "addedAt": "2025-06-30T19:01:17.860Z",
          "dob": "2007-09-26T00:00:00.000Z",
          "sity": "Moscow",
          "totalSpent": "0"
      }
      }
  }
  })
  async getProfile(@Req() req: AuthenticationRequest) {
      console.log(req.user)
      const profile = await this.usersService.getProfile(req.user.userId)

      return {
        user: profile
      }
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Обновить профиль пользователя' })
  @ApiResponse({
  status: 200,
  description: 'Данные обновленного профиля',
  schema: {
      example: {
        "user": {
          "id": 2,
          "phone": "+79042002002",
          "password": "$2b$10$D2yzRoFOqd/mTzvNsqqiueQxjPAyRm4tTn9QbJTqlXfvAN6xyWpI6",
          "name": "Egor",
          "role": "ADMIN",
          "lvl": 0,
          "xp": 0,
          "addedAt": "2025-06-30T19:01:17.860Z",
          "dob": "2007-09-26T00:00:00.000Z",
          "sity": "Moscow",
          "totalSpent": "0"
      }
      }
  }
  })
  @UseGuards(JwtAuthGuard)
  async updateProfle(@Body() updateData: UpdateDto, @Req() req: AuthenticationRequest) {
    const updateProfile = await this.usersService.updateProfile(updateData, req.user)

    return {
      user: updateProfile
    }
  }
}
