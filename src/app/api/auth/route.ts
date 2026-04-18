import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import { verifyUserPin } from "@lib/dynamoDbApi";
import { sessionOptions, SessionData } from "@lib/session";

export async function POST(req: NextRequest) {
  const { id, pin } = await req.json();
  const user = await verifyUserPin(id, pin);
  if (!user) {
    return NextResponse.json({ error: "PINが違います" }, { status: 401 });
  }
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.user = { id: user.id, user: user.user, authority: user.authority };
  await session.save();
  return NextResponse.json(user);
}
