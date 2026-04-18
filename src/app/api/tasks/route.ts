import { NextRequest, NextResponse } from "next/server";

import { createTask, deleteTask, getTasks, updateTask } from "@lib/dynamoDbApi";
import { forbidden, getSessionUser, unauthorized } from "@lib/authGuard";
import { taskPostSchema } from "@lib/schemas";
import { AUTHORITY } from "@const/constDefinition";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  try {
    const tasks = await getTasks();
    return NextResponse.json(tasks);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  if (user.authority !== AUTHORITY.admin) return forbidden();

  const parsed = taskPostSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const body = parsed.data;

  try {
    if (body.type === "create") {
      await createTask({ task: body.task, point: body.point, whose: body.whose });
      return NextResponse.json({ ok: true });
    }
    if (body.type === "update") {
      await updateTask(body.id, { task: body.task, point: body.point, whose: body.whose });
      return NextResponse.json({ ok: true });
    }
    if (body.type === "delete") {
      await deleteTask(body.id);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
