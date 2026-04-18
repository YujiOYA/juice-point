import { NextRequest, NextResponse } from "next/server";

import { createUser, getUsers } from "@lib/dynamoDbApi";

// 初回管理者作成専用エンドポイント。ユーザーが1人以上いる場合は拒否する。
export async function POST(req: NextRequest) {
  const users = await getUsers();
  if (users.length > 0) {
    return NextResponse.json({ error: "Already initialized" }, { status: 403 });
  }
  const { user, pin } = await req.json();
  if (!user || !pin) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  await createUser({ user, pin, authority: "admin" });
  return NextResponse.json({ ok: true });
}
