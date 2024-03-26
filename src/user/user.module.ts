import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [UserService],
})
export class UsersModule { }