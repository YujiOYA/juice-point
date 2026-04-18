import { NextRequest, NextResponse } from "next/server";

import { createReward, deleteReward, getRewards, updateReward } from "@lib/dynamoDbApi";
import { forbidden, getSessionUser, unauthorized } from "@lib/authGuard";
import { rewardPostSchema } from "@lib/schemas";
import { AUTHORITY } from "@const/constDefinition";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  try {
    const rewards = await getRewards();
    return NextResponse.json(rewards);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
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
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
