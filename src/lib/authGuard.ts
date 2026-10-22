import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUsers } from "@lib/dynamoDbApi";
import { sessionOptions, SessionData } from "@lib/session";

/**
 * セッションのユーザーを返す。
 * Cookie の内容をそのまま信用せず DB を引き直し、削除済みユーザーは未ログイン扱い、
 * 権限・名前は DB の最新値を使う（権限変更・削除が最大7日間反映されない問題への対策）。
 */
export async function getSessionUser(): Promise<SessionData["user"] | undefined> {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    if (!session.user) return undefined;
    const [current] = await getUsers(session.user.id);
    if (!current) return undefined;
    return { id: current.id, user: current.user, authority: current.authority };
}

export function unauthorized(): NextResponse {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden(): NextResponse {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
