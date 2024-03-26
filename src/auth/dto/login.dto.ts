import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: "Amir-Alemohammad" })
    @IsNotEmpty()
    username: string;
    @ApiProperty()
    @IsNotEmpty()
    password: string;
}