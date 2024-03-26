import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateItemDto {
    @ApiPropertyOptional()
    name: string;
    @ApiPropertyOptional()
    description: string;
    @ApiPropertyOptional()
    quantity: number;
}