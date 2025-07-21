import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { AdminModule } from './admin/admin.module';
import { ProductsModule } from './products/products.module';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { FeedbackModule } from './feedback/feedback.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [AuthModule, UsersModule, OrdersModule, CartModule, AdminModule, ProductsModule, FeedbackModule, PaymentModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, PrismaService, JwtService],
})
export class AppModule {}
