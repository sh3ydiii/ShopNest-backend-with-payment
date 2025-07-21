import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [PassportModule,
        JwtModule.register({
            secret: "saasasasa",
            signOptions: { expiresIn: '1h'}
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}
