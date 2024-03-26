import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { CustomJWTModule } from 'src/jwt-modules/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), `.env`),
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    AuthModule,
    CustomJWTModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
