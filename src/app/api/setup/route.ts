import { NextRequest, NextResponse } from "next/server";

import { createUser, getUsers } from "@lib/dynamoDbApi";
import { setupSchema } from "@lib/schemas";

// 初回管理者作成専用エンドポイント。ユーザーが1人以上いる場合は拒否する。
export async function POST(req: NextRequest) {
  const parsed = setupSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { user, pin } = parsed.data;

  try {
    const users = await getUsers();
    if (users.length > 0) {
      return NextResponse.json({ error: "Already initialized" }, { status: 403 });
    }
    await createUser({ user, pin, authority: "admin" });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
