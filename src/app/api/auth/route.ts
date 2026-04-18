import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import { verifyUserPin } from "@lib/dynamoDbApi";
import { sessionOptions, SessionData } from "@lib/session";
import { authLoginSchema } from "@lib/schemas";

export async function POST(req: NextRequest) {
  const parsed = authLoginSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { id, pin } = parsed.data;

  try {
    const user = await verifyUserPin(id, pin);
    if (!user) {
      return NextResponse.json({ error: "PINが違います" }, { status: 401 });
    }
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    session.user = { id: user.id, user: user.user, authority: user.authority };
    await session.save();
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
