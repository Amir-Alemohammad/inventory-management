import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import mongoose, { Model } from "mongoose";
import { User } from "src/user/schema/user.schema";
import { AuthService } from "../auth.service";
import { InjectModel } from "@nestjs/mongoose";
import { JwtPayloadDto } from "../dto/payload.dto";
import { AuthMessages } from "../enum/auth.enum";
import { JwtError } from "src/common/enum/error-jwt.enum";
import { Request, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { justSetAuthCookies } from "src/common/utils/auth-cookie";
import { getUserResponse } from "src/common/utils/function";
import { IUser } from "src/user/interface/user-request.interface";
import { CookieKeys } from "src/common/enum/cookie.enum";
import { GetTokenCookieOption } from "src/config/cookie.config";
import { RefreshTokenExpires } from "src/common/constant/expires-data.contant";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private readonly authService: AuthService,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<any> {
        const ctx = context.switchToHttp();
        const req: Request = ctx.getRequest<Request>();
        const res: Response = ctx.getResponse<Response>();
        const accessToken = this.authService.getTokenFromRequestAsCookie(req);
        const refreshToken = this.authService.getRefreshTokenFromRequestAsCookie(req);
        if (accessToken) {
            const jwtVerifyResult = await this.authService.verifyAccessToken(accessToken);
            if (typeof jwtVerifyResult == "string" && jwtVerifyResult == JwtError.Expires) {
                let refreshTokenVerifyResult: JwtPayloadDto | string = await this.authService.verifyRefreshTokenJwt(refreshToken);
                if (typeof refreshTokenVerifyResult == "string" && refreshTokenVerifyResult == JwtError.Expires) {
                    throw new UnauthorizedException(AuthMessages.Login);
                } else if (typeof refreshTokenVerifyResult == "object" && "id" in refreshTokenVerifyResult) {
                    const user = await this.userModel.findById(refreshTokenVerifyResult.id);
                    if (!user) throw new UnauthorizedException(AuthMessages.NotFoundAccount);

                    const access_token = this.authService.signAccess_tokenJwt({ id: user.id });
                    const refresh_token = this.authService.signRefresh_tokenJwt({ id: user.id });
                    Object.assign(user, { access_token, refresh_token });
                    await user.save();
                    justSetAuthCookies(req, res, { access_token, refresh_token })
                    const userObject: IUser = getUserResponse(user);
                    req.user = userObject
                } else {
                    throw new UnauthorizedException(AuthMessages.LoginAgain);
                }
            } else if (typeof jwtVerifyResult == "object" && "id" in jwtVerifyResult) {
                const user = await this.userModel.findById(jwtVerifyResult.id);
                if (!user) throw new UnauthorizedException(AuthMessages.NotFoundAccount);
                const userObject: IUser = getUserResponse(user);
                req.user = userObject
                if (!refreshToken) {
                    const refresh_token = this.authService.signRefresh_tokenJwt({ id: user.id });
                    res.cookie(CookieKeys.RefreshToken, refresh_token, GetTokenCookieOption(RefreshTokenExpires));
                    Object.assign(user, { refresh_token });
                    await user.save();
                }
            } else {
                throw new UnauthorizedException(AuthMessages.LoginAgain);
            }
        } else if (refreshToken) {
            let refreshTokenVerifyResult: JwtPayloadDto | string = await this.authService.verifyRefreshTokenJwt(refreshToken);
            if (typeof refreshTokenVerifyResult == "string" && refreshTokenVerifyResult == JwtError.Expires) {
                throw new UnauthorizedException(AuthMessages.Login);
            } else if (typeof refreshTokenVerifyResult == "object" && "id" in refreshTokenVerifyResult) {
                const user = await this.userModel.findById(refreshTokenVerifyResult.id);
                if (!user) throw new UnauthorizedException(AuthMessages.NotFoundAccount);
                const access_token = this.authService.signAccess_tokenJwt({ id: user.id });
                const refresh_token = this.authService.signRefresh_tokenJwt({ id: user.id });
                Object.assign(user, { access_token, refresh_token });
                await user.save();
                justSetAuthCookies(req, res, { access_token, refresh_token })
                const userObject: IUser = getUserResponse(user);
                req.user = userObject
            } else {
                throw new UnauthorizedException(AuthMessages.LoginAgain);
            }
        }
        return super.canActivate(context);
    }
}