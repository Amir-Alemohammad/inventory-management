import { Request } from "express";
import * as qs from 'querystring';
import { IUser } from "src/user/interface/user-request.interface";
import { User } from "src/user/schema/user.schema";

export function getAccessTokenFromRequest(req: Request) {
    const headerCookies: any = qs.parse(req?.headers?.cookie);
    const bearerToken = req?.headers?.authorization
    const [bearer, token] = bearerToken?.split(' ') || [undefined, undefined];
    const accessToken = req?.signedCookies?.access_token ?? req?.cookies?.access_token ?? headerCookies?.access_token ?? token ?? null;
    return accessToken;
}
export function getRefreshTokenFromRequest(req: Request) {
    const headerCookies: any = qs.parse(req?.headers?.cookie);
    const refreshToken = req?.signedCookies?.refresh_token ?? req?.cookies?.refresh_token ?? headerCookies?.refresh_token ?? null;
    return refreshToken
}
export function getUserResponse(user: User): IUser {
    return {
        username: user.username,
    };
}