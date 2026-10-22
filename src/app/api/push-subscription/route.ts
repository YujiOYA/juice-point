import { NextRequest, NextResponse } from "next/server";

import { AUTHORITY } from "@const/constDefinition";
import { forbidden, getSessionUser, unauthorized } from "@lib/authGuard";
import { deletePushSubscription, savePushSubscription } from "@lib/dynamoDbApi";
import { pushSubscriptionDeleteSchema, pushSubscriptionPostSchema } from "@lib/schemas";

export async function POST(req: NextRequest) {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    // 通知は親向け（全員の申請内容を含む）なので購読できるのは管理者のみ
    if (user.authority !== AUTHORITY.admin) return forbidden();

    const parsed = pushSubscriptionPostSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    try {
        await savePushSubscription(parsed.data.endpoint, JSON.stringify(parsed.data.subscription));
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    if (user.authority !== AUTHORITY.admin) return forbidden();

    const parsed = pushSubscriptionDeleteSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

    try {
        await deletePushSubscription(parsed.data.endpoint);
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
