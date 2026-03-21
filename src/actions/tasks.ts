"use server";

import { revalidatePath } from "next/cache";

import { createTask, deleteTask, updateTask } from "@lib/dynamoDbApi";

export async function createTaskAction(data: { task: string; point: string; whose: string }) {
  await createTask(data);
  revalidatePath("/admin");
}

export async function updateTaskAction(id: string, data: { task: string; point: string; whose: string }) {
  await updateTask(id, data);
  revalidatePath("/admin");
}

export async function deleteTaskAction(id: string) {
  await deleteTask(id);
  revalidatePath("/admin");
}
