import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: "Amir-Alemohammad" })
    @IsNotEmpty()
    @IsString()
    username: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}