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
export function paginationGenerator(count: number = 0, page: number = 0, limit: number = 0) {
    return {
        totalCount: count,
        page: +page,
        limit,
        pageCount: Math.ceil(count / limit)
    }
}
export function paginationSolver(page: number = 1, limit: number = 10) {
    if (!page || page < 1) {
        page = 0
    }
    if (!limit || limit <= 0) limit = 10;
    const skip = page * limit;
    return {
        page,
        limit,
        skip
    }
}
export function getUserResponse(user: User): IUser {
    return {
        username: user.username,
    };
}