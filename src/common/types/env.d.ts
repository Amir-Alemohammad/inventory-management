namespace NodeJS {
    interface ProcessEnv {
        //Application
        PORT: number;
        NODE_ENV: string;
        //Database
        MONGO_URL: string;
        //origins
        FRONTEND_URL: string;
        //jwt tokens
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
        //cookie
        COOKIE_SECRET: string;
    }
}