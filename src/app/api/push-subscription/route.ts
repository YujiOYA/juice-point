import { NextRequest, NextResponse } from "next/server";

import { deletePushSubscription, savePushSubscription } from "@lib/dynamoDbApi";

export async function POST(req: NextRequest) {
  const { endpoint, subscription } = await req.json();
  if (!endpoint || !subscription) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  await savePushSubscription(endpoint, JSON.stringify(subscription));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json();
  if (!endpoint) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  await deletePushSubscription(endpoint);
  return NextResponse.json({ ok: true });
}
