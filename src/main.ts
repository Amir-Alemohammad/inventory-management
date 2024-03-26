import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerConfigInit } from './config/swagger.config';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app)
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      skipMissingProperties: false
    })
  );
  await app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`)
    console.log(`http://localhost:${process.env.PORT}/swagger`)
  });
}
bootstrap();
