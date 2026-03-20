import { NextRequest, NextResponse } from "next/server";

import { verifyUserPin } from "@lib/dynamoDbApi";

export async function POST(req: NextRequest) {
  const { id, pin } = await req.json();
  const user = await verifyUserPin(id, pin);
  if (!user) {
    return NextResponse.json({ error: "PINが違います" }, { status: 401 });
  }
  return NextResponse.json(user);
}
