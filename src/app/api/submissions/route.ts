import { NextRequest, NextResponse } from "next/server";

import { createSubmission, getSubmissions, updateSubmissionIsUsed, updateSubmissionStatus } from "@lib/dynamoDbApi";

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
      .filter((s) => s.whoDid === body.userId && s.status === "承認" && s.isUsed === "未使用")
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    let remaining = 10;
    const toUse: string[] = [];
    for (const s of usable) {
      if (remaining <= 0) break;
      toUse.push(s.id);
      remaining -= Number(s.point);
    }

    if (remaining > 0) {
      return NextResponse.json({ error: "ポイントが足りません" }, { status: 400 });
    }

    await Promise.all(toUse.map((id) => updateSubmissionIsUsed(id)));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
