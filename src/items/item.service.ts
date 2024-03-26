import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Item } from "./schema/item.schema";
import { Model, isValidObjectId } from "mongoose";
import { CreateItemDto } from "./dto/create.dto";
import { IUser } from "../user/interface/user-request.interface";
import { User } from "../user/schema/user.schema";
import { PaginationDto } from "../common/dto/pagination.dto";
import { SortDto } from "../common/dto/sortable.dto";
import { paginationGenerator, paginationSolver } from "../common/utils/function";
import { ItemMessage } from "./enum/item.enum";
import { UpdateItemDto } from "./dto/update.dto";

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
    async list(paginationDto: PaginationDto, sortDto: SortDto, searchTerm: string) {
        const { limit, skip, page } = paginationSolver(+paginationDto.page, +paginationDto.limit);
        searchTerm = searchTerm ? searchTerm.toLocaleLowerCase() : '';
        const items = await this.itemModel.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
            ]
        })
            .select('-__v -createdAt -updatedAt')
            .skip(skip)
            .limit(limit)
            .exec()
        const count = await this.itemModel.countDocuments({});
        return {
            pagination: paginationGenerator(count, page, limit),
            items,
        }
    }
    async findOne(id: string) {
        if (!isValidObjectId(id)) throw new BadRequestException(ItemMessage.InvalidIdFormat);
        const item = await this.itemModel.findById(id).select('-__v');
        if (!item) throw new NotFoundException(ItemMessage.NotFound)
        return {
            item,
        }
    }
    async update(id: string, updateItemDto: UpdateItemDto) {
        const { item } = await this.findOne(id);
        let { name, description, quantity } = updateItemDto;
        if (!name) name = item.name;
        if (!description) description = item.description;
        if (!quantity) quantity = item.quantity;
        Object.assign(item, {
            name,
            description,
            quantity,
        });
        return await item.save();
    }
    async remove(id: string) {
        const { item } = await this.findOne(id);
        return await this.itemModel.deleteOne({ _id: item._id });
    }
}