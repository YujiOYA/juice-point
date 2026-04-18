import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { sessionOptions, SessionData } from "@lib/session";

export async function getSessionUser(): Promise<SessionData["user"] | undefined> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session.user;
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
