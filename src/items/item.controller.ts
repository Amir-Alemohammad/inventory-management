import { Body, Controller, HttpStatus, Post, Req } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ItemService } from "./item.service";
import { SwaggerConsumes } from "src/common/enum/swagger.enum";
import { CreateItemDto } from "./dto/create.dto";
import { Request } from "express";
import { ItemMessage } from "./enum/item.enum";
import { AuthDecorator } from "src/common/decorators/auth.decorator";

@Controller('item')
@ApiTags("Items")
@AuthDecorator()
export class ItemController {
    constructor(
        private readonly itemService: ItemService,
    ) { }
    @Post()
    @ApiConsumes(SwaggerConsumes.JSON)
    async create(@Body() createItemDto: CreateItemDto, @Req() req: Request) {
        const user = req.user;
        const item = await this.itemService.create(createItemDto, user);
        return {
            item,
            statusCode: HttpStatus.CREATED,
            message: ItemMessage.Created,
        }
    }
}