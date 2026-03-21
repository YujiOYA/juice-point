"use server";

import { revalidatePath } from "next/cache";

import { createSubmission, getSubmissions, updateSubmissionIsUsed, updateSubmissionStatus } from "@lib/dynamoDbApi";

export async function registerSubmissionAction(data: { whatYouDid: string; whoDid: string; point: string }) {
  await createSubmission(data);
  revalidatePath("/");
}

export async function approveSubmissionAction(id: string) {
  await updateSubmissionStatus(id, "承認");
  revalidatePath("/");
}

export async function disapproveSubmissionAction(id: string) {
  await updateSubmissionStatus(id, "却下");
  revalidatePath("/");
}

export async function usePointsAction(userId: string) {
  const all = await getSubmissions();
  const usable = all
    .filter((s) => s.whoDid === userId && s.status === "承認" && s.isUsed === "未使用")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  let remaining = 10;
  const toUse: string[] = [];
  for (const s of usable) {
    if (remaining <= 0) break;
    toUse.push(s.id);
    remaining -= Number(s.point);
  }

  if (remaining > 0) throw new Error("ポイントが足りません");

  await Promise.all(toUse.map((id) => updateSubmissionIsUsed(id)));
  revalidatePath("/");
}
