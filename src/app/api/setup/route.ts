import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { NextRequest, NextResponse } from "next/server";

import { createUser, getUsers } from "@lib/dynamoDbApi";
import { setupSchema } from "@lib/schemas";

// このIDを持つレコードが存在するか否かで「初期化済み」を判定する
const SETUP_ADMIN_ID = "00000000-0000-0000-0000-setup-admin01";

// 初回管理者作成専用エンドポイント。ユーザーが1人以上いる場合は拒否する。
export async function POST(req: NextRequest) {
    const parsed = setupSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { user, pin } = parsed.data;

    try {
        // 補助的な早期チェック（DBラウンドトリップを減らすため）
        const users = await getUsers();
        if (users.length > 0) {
            return NextResponse.json({ error: "Already initialized" }, { status: 403 });
        }
        // 固定IDで書き込むことで attribute_not_exists(id) が原子的なロックとして機能する
        await createUser({ id: SETUP_ADMIN_ID, user, pin, authority: "admin" });
        return NextResponse.json({ ok: true });
    } catch (e) {
        if (e instanceof ConditionalCheckFailedException) {
            return NextResponse.json({ error: "Already initialized" }, { status: 403 });
        }
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
