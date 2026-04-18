import { SessionOptions } from "iron-session";

export interface SessionData {
  user?: {
    id: string;
    user: string;
    authority: string;
  };
}

export const COOKIE_NAME = "otetusdai-session";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: COOKIE_NAME,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7日間
  },
};
