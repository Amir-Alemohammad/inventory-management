import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Item } from "./schema/item.schema";
import { Model } from "mongoose";
import { CreateItemDto } from "./dto/create.dto";
import { IUser } from "src/user/interface/user-request.interface";
import { User } from "src/user/schema/user.schema";

@Injectable()
export class ItemService {
    constructor(
        @InjectModel(Item.name) private itemModel: Model<Item>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }
    async create(createItemDto: CreateItemDto, user: IUser) {
        const { name, description, quantity } = createItemDto
        const foundUser = await this.userModel.findOne({ username: user.username })
        const item = await this.itemModel.create({
            name,
            description,
            quantity,
            user: foundUser.id,
        });
        await foundUser.updateOne({
            $push: {
                items: item.id,
            },
        });
        return item;
    }
}