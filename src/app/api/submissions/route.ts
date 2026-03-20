import { NextRequest, NextResponse } from "next/server";

import { createSubmission, getSubmissions, updateSubmissionStatus } from "@/lib/dynamoDbApi";

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

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
