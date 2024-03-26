import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Item, ItemSchema } from "./schema/item.schema";
import { User, UserSchema } from "src/user/schema/user.schema";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Item.name,
                schema: ItemSchema,
            },
            {
                name: User.name,
                schema: UserSchema,
            }
        ])
    ],
    controllers: [ItemController],
    providers: [ItemService, AuthService, UserService],
})
export class ItemModule { }