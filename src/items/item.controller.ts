import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiConsumes, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ItemService } from "./item.service";
import { SwaggerConsumes } from "../common/enum/swagger.enum";
import { CreateItemDto } from "./dto/create.dto";
import { Request } from "express";
import { ItemMessage } from "./enum/item.enum";
import { AuthDecorator } from "../common/decorators/auth.decorator";
import { Pagination } from "../common/decorators/pagination.decorator";
import { Sortable } from "../common/decorators/sort.decorator";
import { PaginationDto } from "../common/dto/pagination.dto";
import { SortDto } from "../common/dto/sortable.dto";
import { UpdateItemDto } from "./dto/update.dto";

@Controller('item')
@ApiTags("Items")
export class ItemController {
    constructor(
        private readonly itemService: ItemService,
    ) { }

    @AuthDecorator()
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
    @Get()
    @Pagination()
    @ApiQuery({ name: "search", type: "string", required: false, allowEmptyValue: true, })
    @Sortable()
    async list(@Query() paginationDto: PaginationDto, @Query() sortDto: SortDto, @Query('search') searchTerm?: string) {
        return await this.itemService.list(paginationDto, sortDto, searchTerm);
    }
    @Get(":id")
    @ApiParam({ type: "string", name: 'id' })
    async findOne(@Param('id') id: string) {
        return await this.itemService.findOne(id);
    }

    @AuthDecorator()
    @Put(':id')
    @ApiParam({ type: "string", name: 'id' })
    @ApiConsumes(SwaggerConsumes.JSON)
    async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
        await this.itemService.update(id, updateItemDto);
        return {
            statusCode: HttpStatus.OK,
            message: ItemMessage.Updated,
        }
    }

    @AuthDecorator()
    @Delete(":id")
    @ApiParam({ type: "string", name: 'id' })
    async remove(@Param('id') id: string) {
        await this.itemService.remove(id);
        return {
            statusCode: HttpStatus.OK,
            message: ItemMessage.Deleted,
        }
    }
}