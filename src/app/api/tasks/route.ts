import { NextRequest, NextResponse } from "next/server";

import { createTask, deleteTask, getTasks, updateTask } from "@lib/dynamoDbApi";

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
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
