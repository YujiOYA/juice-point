import { NextRequest, NextResponse } from "next/server";

import { createUser, deleteUser, getUsers, updateUser } from "@lib/dynamoDbApi";
import { forbidden, getSessionUser, unauthorized } from "@lib/authGuard";
import { userPostSchema } from "@lib/schemas";
import { AUTHORITY } from "@const/constDefinition";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  if (user.authority !== AUTHORITY.admin) return forbidden();
  try {
    const users = await getUsers();
    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  if (user.authority !== AUTHORITY.admin) return forbidden();

  const parsed = userPostSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const body = parsed.data;

  try {
    if (body.type === "create") {
      await createUser({ user: body.user, pin: body.pin, authority: body.authority });
      return NextResponse.json({ ok: true });
    }
    if (body.type === "update") {
      await updateUser(body.id, { user: body.user, pin: body.pin, authority: body.authority });
      return NextResponse.json({ ok: true });
    }
    if (body.type === "delete") {
      await deleteUser(body.id);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
