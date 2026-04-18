import { NextRequest, NextResponse } from "next/server";
import { unsealData } from "iron-session";

import { COOKIE_NAME, SessionData } from "@lib/session";
import { ENV } from "@const/constDefinition";

// 認証不要のAPIパス
const PUBLIC_API_PATHS = ["/api/auth", "/api/setup"];

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
