import { NextRequest, NextResponse } from "next/server";

import { createUser, deleteUser, getUsers, updateUser } from "@lib/dynamoDbApi";

export async function GET() {
  const users = await getUsers();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type } = body;

  if (type === "create") {
    await createUser({ user: body.user, pin: body.pin, authority: body.authority });
    return NextResponse.json({ ok: true });
  }

  if (type === "update") {
    await updateUser(body.id, { user: body.user, pin: body.pin || undefined, authority: body.authority });
    return NextResponse.json({ ok: true });
  }

  if (type === "delete") {
    await deleteUser(body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
