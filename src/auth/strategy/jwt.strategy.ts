import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { getAccessTokenFromRequest, getRefreshTokenFromRequest } from "src/common/utils/function";
import { AuthMessages } from "../enum/auth.enum";
import { Request } from "express";
import { JwtPayloadDto } from "../dto/payload.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "src/user/schema/user.schema";
import { Model } from "mongoose";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
    ) {
        let superData: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWTFromCookie,
            ]),
            secretOrKeyProvider: (req: Request, jwtToken, done) => {
                const token = getAccessTokenFromRequest(req);
                const refreshToken = getRefreshTokenFromRequest(req)
                if (token) return done(null, process.env.ACCESS_TOKEN_SECRET);
                else if (refreshToken) return done(null, process.env.REFRESH_TOKEN_SECRET);
                throw new UnauthorizedException(AuthMessages.Login)
            },
        }
        super(superData)
    }
    private static extractJWTFromCookie(req: Request): string | null {
        const token = getAccessTokenFromRequest(req);
        const refreshToken = getRefreshTokenFromRequest(req)
        if (!token) {
            if (refreshToken) {
                return refreshToken;
            } else throw new UnauthorizedException(AuthMessages.Login)
        }
        return token
    }
    async validate(payload: JwtPayloadDto) {
        const user = await this.userModel.findById(payload.id);
        if (!user) throw new UnauthorizedException(AuthMessages.Login);
        return user
    }
}
