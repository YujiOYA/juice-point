import { unsealData } from "iron-session";
import { NextRequest, NextResponse } from "next/server";

import { ENV } from "@const/constDefinition";
import { COOKIE_NAME, SessionData } from "@lib/session";

// 認証不要のAPIパス
const PUBLIC_API_PATHS = ["/api/auth", "/api/setup"];
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function isSameOrigin(request: NextRequest): boolean {
    if (request.headers.get("sec-fetch-site") === "cross-site") return false;
    const origin = request.headers.get("origin");
    if (!origin) return true;
    try {
        return new URL(origin).host === request.headers.get("host");
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // /admin へのアクセス：セッションがなければトップにリダイレクト
    if (pathname.startsWith("/admin")) {
        const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
        if (!cookieValue) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        try {
            const data = await unsealData<SessionData>(cookieValue, {
                password: ENV.sessionSecret,
            });
            if (!data.user || data.user.authority !== "admin") {
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // /api/* 以外はスルー
    if (!pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    // 状態を変えるリクエストは同一オリジンからのみ受け付ける（CSRF 対策。SameSite=Lax の補強）
    if (!SAFE_METHODS.has(request.method) && !isSameOrigin(request)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 公開エンドポイントはスルー
    if (PUBLIC_API_PATHS.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // セッションCookieを検証
    const cookieValue = request.cookies.get(COOKIE_NAME)?.value;
    if (!cookieValue) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const data = await unsealData<SessionData>(cookieValue, {
            password: ENV.sessionSecret,
        });
        if (!data.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/:path*"],
};
