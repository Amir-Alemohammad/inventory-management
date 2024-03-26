import { Request, Response } from "express"
import { HttpStatus } from "@nestjs/common";
import { CookieKeys } from "../enum/cookie.enum";
import { GetTokenCookieOption } from "../../config/cookie.config";
import { AccessTokenExpires, RefreshTokenExpires } from "../constant/expires-data.contant";
import { AuthMessages } from "../../auth/enum/auth.enum";
type TokenType = { access_token: string, refresh_token: string }

export async function setAuthCookies(req: Request, res: Response, response: TokenType) {
    const { access_token, refresh_token } = response;
    res.cookie(CookieKeys.AccessToken, access_token, GetTokenCookieOption(AccessTokenExpires))
    res.cookie(CookieKeys.RefreshToken, refresh_token, GetTokenCookieOption(RefreshTokenExpires))
    res.send({
        statusCode: HttpStatus.OK,
        data: {
            message: AuthMessages.SuccessLogin,
            access_token,
            refresh_token,
        }
    })
}
export async function justSetAuthCookies(req: Request, res: Response, response: TokenType) {
    const { access_token, refresh_token } = response;
    res.cookie(CookieKeys.AccessToken, access_token, GetTokenCookieOption(AccessTokenExpires))
    res.cookie(CookieKeys.RefreshToken, refresh_token, GetTokenCookieOption(RefreshTokenExpires))
}