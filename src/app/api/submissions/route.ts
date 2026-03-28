import { NextRequest, NextResponse } from "next/server";

import { createSubmission, createTask, deleteSubmission, getSubmissions, updateSubmissionPoint, updateSubmissionStatus } from "@lib/dynamoDbApi";
import { SubmissionType } from "@type/submission";

export async function GET() {
  const submissions = await getSubmissions();
  return NextResponse.json(submissions);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type } = body;

  if (type === "register") {
    await createSubmission({
      whatYouDid: body.whatYouDid,
      whoDid: body.whoDid,
      point: body.point,
    });
    return NextResponse.json({ ok: true });
  }

  if (type === "registerOneTimeTask") {
    await createSubmission({
      whatYouDid: body.whatYouDid,
      whoDid: body.whoDid,
      point: body.point,
      submissionType: SubmissionType.OneTimeTask,
    });
    return NextResponse.json({ ok: true });
  }

  if (type === "approveOneTimeTask") {
    await updateSubmissionPoint(body.id, Number(body.newPoint));
    await updateSubmissionStatus(body.id, "承認");
    return NextResponse.json({ ok: true });
  }

  if (type === "requestTask") {
    await createSubmission({
      whatYouDid: body.whatYouDid,
      whoDid: body.whoDid,
      point: body.point,
      submissionType: SubmissionType.TaskRequest,
    });
    return NextResponse.json({ ok: true });
  }

  if (type === "approveTaskRequest") {
    await createTask({
      task: body.taskName,
      point: body.point,
      whose: body.whoDid,
    });
    await updateSubmissionStatus(body.id, "承認");
    return NextResponse.json({ ok: true });
  }

  if (type === "approve") {
    await updateSubmissionStatus(body.id, "承認");
    return NextResponse.json({ ok: true });
  }

  if (type === "disapprove") {
    await updateSubmissionStatus(body.id, "却下");
    return NextResponse.json({ ok: true });
  }

  if (type === "restore") {
    await updateSubmissionStatus(body.id, "未承認");
    return NextResponse.json({ ok: true });
  }

  if (type === "delete") {
    await deleteSubmission(body.id);
    return NextResponse.json({ ok: true });
  }

  if (type === "updatePoint") {
    await updateSubmissionPoint(body.id, Number(body.newPoint));
    return NextResponse.json({ ok: true });
  }

  if (type === "usePoints") {
    const all = await getSubmissions();
    const usable = all
      .filter((s) => s.whoDid === body.userId && s.status === "承認")
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    let remaining = Number(body.point);
    const toDelete: string[] = [];
    let toUpdate: { id: string; newPoint: number } | null = null;

    for (const s of usable) {
      if (remaining <= 0) break;
      const sPoint = Number(s.point);
      if (sPoint <= remaining) {
        toDelete.push(s.id);
        remaining -= sPoint;
      } else {
        toUpdate = { id: s.id, newPoint: sPoint - remaining };
        remaining = 0;
      }
    }

    if (remaining > 0) {
      return NextResponse.json({ error: "ポイントが足りません" }, { status: 400 });
    }

    await Promise.all([
      ...toDelete.map((id) => deleteSubmission(id)),
      ...(toUpdate ? [updateSubmissionPoint(toUpdate.id, toUpdate.newPoint)] : []),
    ]);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
