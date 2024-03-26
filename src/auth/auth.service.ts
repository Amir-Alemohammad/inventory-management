import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Request } from "express";
import { Model } from "mongoose";
import { User } from "src/user/schema/user.schema";
import { JwtPayloadDto } from "./dto/payload.dto";
import { AuthEnum } from "src/common/enum/auth.enum";
import { AuthMessages } from "./enum/auth.enum";
import { parse } from 'querystring';
import { JwtError } from "src/common/enum/error-jwt.enum";
import { RegisterDto } from "./dto/register.dto";
import { UserService } from "src/user/user.service";
import { compareSync, hashSync } from "bcrypt";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }
    async register(registerDto: RegisterDto) {
        let { username, password } = registerDto;
        await this.userService.checkExistByUsername(username);
        password = hashSync(password, AuthEnum.SALT_PASS);
        const user = await this.userModel.create({
            username,
            password,
        });
        return user.save();
    }
    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;
        const user = await this.userModel.findOne({ username });
        if (!user) throw new NotFoundException(AuthMessages.NotFoundAccount);
        if (!compareSync(password, user.password)) throw new BadRequestException(AuthMessages.UsernameOrPasswordIsIncorrect);
        user.access_token = this.signAccess_tokenJwt({ id: user.id })
        user.refresh_token = this.signRefresh_tokenJwt({ id: user.id })
        await user.save();
        return {
            access_token: user.access_token,
            refresh_token: user.refresh_token,
            user,
        }
    }
    signAccess_tokenJwt(payload: JwtPayloadDto) {
        return this.jwtService.sign(payload, { expiresIn: AuthEnum.ACCESS_TOKEN_EXPIRERS, secret: process.env.ACCESS_TOKEN_SECRET });
    }
    signRefresh_tokenJwt(payload: JwtPayloadDto) {
        return this.jwtService.sign(payload, { expiresIn: AuthEnum.REFRESH_TOKEN_EXPIRERS, secret: process.env.REFRESH_TOKEN_SECRET });
    }
    extractTokenAsBearer(bearerToken: string) {
        const [bearer, token] = bearerToken?.split(' ') || [undefined, undefined];
        if (!token || !bearer) throw new UnauthorizedException(AuthMessages.Login);
        if (bearer?.toLowerCase() !== 'bearer') throw new UnauthorizedException(AuthMessages.Login);
        return token;
    }
    getTokenFromRequestAsBearer(req: Request) {
        const token: string | undefined = req?.headers?.authorization;
        return this.extractTokenAsBearer(token);
    }
    getTokenFromRequestAsCookie(req: Request) {
        const headerCookies: any = parse(req?.headers?.cookie);
        const bearerToken = req?.headers?.authorization;
        const [bearer, token] = bearerToken?.split(' ') || [undefined, undefined];
        const accessToken: string | undefined = req?.signedCookies?.access_token ?? req?.cookies?.access_token ?? headerCookies?.access_token ?? token ?? null;
        return accessToken
    }
    getRefreshTokenFromRequestAsCookie(req: Request) {
        const headerCookies: any = parse(req.headers.cookie);
        const token: string | undefined = req?.signedCookies?.refresh_token ?? req?.cookies?.refresh_token ?? headerCookies?.refresh_token;
        return token
    }
    async verifyAccessToken(token: string): Promise<any> {
        try {
            const { ACCESS_TOKEN_SECRET: secret } = process.env;
            return this.jwtService.verify(token, { secret });
        } catch (error) {
            return JwtError.Expires

        }
    }
    async verifyRefreshTokenJwt(token: string): Promise<any> {
        try {
            const { REFRESH_TOKEN_SECRET: secret } = process.env;
            return this.jwtService.verify(token, { secret });
        } catch (error) {
            return JwtError.Expires
        }
    }
}