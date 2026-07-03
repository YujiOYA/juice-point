import { NextRequest, NextResponse } from "next/server";

import { AUTHORITY } from "@const/constDefinition";
import { forbidden, getSessionUser, unauthorized } from "@lib/authGuard";
import { createReward, deleteReward, getRewards, updateReward } from "@lib/dynamoDbApi";
import { rewardPostSchema } from "@lib/schemas";

export async function GET() {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    try {
        const rewards = await getRewards();
        return NextResponse.json(rewards);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = await getSessionUser();
    if (!user) return unauthorized();
    if (user.authority !== AUTHORITY.admin) return forbidden();

    const parsed = rewardPostSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const body = parsed.data;

    try {
        if (body.type === "create") {
            await createReward({ name: body.name, point: body.point, whose: body.whose });
            return NextResponse.json({ ok: true });
        }
        if (body.type === "update") {
            await updateReward(body.id, { name: body.name, point: body.point, whose: body.whose });
            return NextResponse.json({ ok: true });
        }
        if (body.type === "delete") {
            await deleteReward(body.id);
            return NextResponse.json({ ok: true });
        }
        return NextResponse.json({ error: "Unknown type" }, { status: 400 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
