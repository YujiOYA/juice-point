"use server";

import { verifyUserPin } from "@lib/dynamoDbApi";
import { User } from "@type/user";

export async function loginAction(id: string, pin: string): Promise<User | null> {
  return verifyUserPin(id, pin);
}
