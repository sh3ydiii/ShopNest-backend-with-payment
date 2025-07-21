import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())

  app.enableCors({
    origin: 'http://localhost:3000', // URL фронтенда
    credentials: true,               // чтобы куки шли с запросами
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true,
  }));

  const config = new DocumentBuilder()
  .setTitle('StyleShop API')
  .setDescription('API документация интернет-магазина')
  .setVersion('1.0')
  .addBearerAuth() // если используешь JWT
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
