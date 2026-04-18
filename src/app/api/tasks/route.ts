import { NextRequest, NextResponse } from "next/server";

import { createTask, deleteTask, getTasks, updateTask } from "@lib/dynamoDbApi";
import { forbidden, getSessionUser, unauthorized } from "@lib/authGuard";
import { AUTHORITY } from "@const/constDefinition";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  if (user.authority !== AUTHORITY.admin) return forbidden();

  const body = await req.json();
  const { type } = body;

  if (type === "create") {
    await createTask({ task: body.task, point: body.point, whose: body.whose });
    return NextResponse.json({ ok: true });
  }

  if (type === "update") {
    await updateTask(body.id, { task: body.task, point: body.point, whose: body.whose });
    return NextResponse.json({ ok: true });
  }

  if (type === "delete") {
    await deleteTask(body.id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
