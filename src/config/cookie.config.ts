import { CookieOptions } from "express"
export function GetTokenCookieOption(expires: number): CookieOptions {
    return {
        httpOnly: true,
        secure: false, // for production is true
        signed: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + expires),
        domain: process.env.FRONTEND_URL,
    }
}