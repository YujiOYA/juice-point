import { SessionOptions } from "iron-session";

import { ENV } from "@const/constDefinition";

export interface SessionData {
    user?: {
        id: string;
        user: string;
        authority: string;
    };
}

export const COOKIE_NAME = "otetusdai-session";

export const sessionOptions: SessionOptions = {
    password: ENV.sessionSecret,
    cookieName: COOKIE_NAME,
    cookieOptions: {
        secure: ENV.isProduction,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7日間
    },
};
