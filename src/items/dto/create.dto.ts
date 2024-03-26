import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateItemDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;
    @ApiProperty({ type: Number })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}