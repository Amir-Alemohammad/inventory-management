import { Global, Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { config } from "dotenv";
import { join } from "path";
import { JwtStrategy } from "../auth/strategy/jwt.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../user/schema/user.schema";
config({
    path: join(process.cwd(), `.env`)
})
@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.ACCESS_TOKEN_SECRET,
            signOptions: {
                expiresIn: '1w',
            }
        }),
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            }
        ])
    ],
    providers: [JwtService, JwtStrategy],
    exports: [JwtService]
})
export class CustomJWTModule { }