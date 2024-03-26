import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateItemDto {
    @ApiPropertyOptional()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    quantity: number;
}