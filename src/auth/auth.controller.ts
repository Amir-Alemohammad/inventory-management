import { Body, Controller, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { SwaggerConsumes } from "../common/enum/swagger.enum";
import { AuthMessages } from "./enum/auth.enum";
import { LoginDto } from "./dto/login.dto";
import { setAuthCookies } from "../common/utils/auth-cookie";
import { Request, Response } from "express";

@Controller('auth')
@ApiTags('Authorization')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }
    @Post('register')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async register(@Body() registerDto: RegisterDto) {
        await this.authService.register(registerDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: AuthMessages.SuccessRegister,
        }
    }
    @Post('login')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
        const { access_token, refresh_token } = await this.authService.login(loginDto);
        await setAuthCookies(req, res, { access_token, refresh_token });
        return {
            statusCode: HttpStatus.OK,
            access_token,
            refresh_token,
            message: AuthMessages.Login,
        }
    }
}