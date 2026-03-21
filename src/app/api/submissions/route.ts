import { NextRequest, NextResponse } from "next/server";

import { createSubmission, deleteSubmission, getSubmissions, updateSubmissionPoint, updateSubmissionStatus } from "@lib/dynamoDbApi";

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

  if (type === "approve") {
    await updateSubmissionStatus(body.id, "承認");
    return NextResponse.json({ ok: true });
  }

  if (type === "disapprove") {
    await updateSubmissionStatus(body.id, "却下");
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
