import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { verifyUserPin } from "@lib/dynamoDbApi";
import { authLoginSchema } from "@lib/schemas";
import { sessionOptions, SessionData } from "@lib/session";

export async function POST(req: NextRequest) {
    const parsed = authLoginSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { id, pin } = parsed.data;

    try {
        const result = await verifyUserPin(id, pin);
        if (result.status === "locked") {
            const retryAfter = Math.ceil((Date.parse(result.lockedUntil) - Date.now()) / 1000);
            return NextResponse.json(
                { error: "PINを続けて間違えたため、しばらくログインできません" },
                { status: 429, headers: { "Retry-After": String(Math.max(retryAfter, 1)) } },
            );
        }
        if (result.status === "invalid") {
            return NextResponse.json({ error: "PINが違います" }, { status: 401 });
        }
        const { user } = result;
        const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
        session.user = { id: user.id, user: user.user, authority: user.authority };
        await session.save();
        return NextResponse.json(user);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
