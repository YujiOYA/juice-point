import { NextRequest, NextResponse } from "next/server";

import { createReward, deleteReward, getRewards, updateReward } from "@lib/dynamoDbApi";
import { forbidden, getSessionUser, unauthorized } from "@lib/authGuard";
import { AUTHORITY } from "@const/constDefinition";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const rewards = await getRewards();
  return NextResponse.json(rewards);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  if (user.authority !== AUTHORITY.admin) return forbidden();

  const body = await req.json();
  const { type } = body;

  if (type === "create") {
    await createReward({ name: body.name, point: body.point, whose: body.whose });
    return NextResponse.json({ ok: true });
  }

  if (type === "update") {
    await updateReward(body.id, { name: body.name, point: body.point, whose: body.whose });
    return NextResponse.json({ ok: true });
  }

  if (type === "delete") {
    await deleteReward(body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
