import PageClient from "@app/PageClient";
import InitialSetupClient from "@app/InitialSetupClient";
import { getUsers, getTasks, getSubmissions, getRewards } from "@lib/dynamoDbApi";
import { getSessionUser } from "@lib/authGuard";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const users = await getUsers();

  if (users.length === 0) {
    return <InitialSetupClient />;
  }

  const sessionUser = await getSessionUser();

  const [tasks, submissions, rewards] = sessionUser
    ? await Promise.all([getTasks(), getSubmissions(), getRewards()])
    : [[], [], []];

  return <PageClient users={users} tasks={tasks} submissions={submissions} rewards={rewards} sessionUser={sessionUser ?? null} next={next ?? null} />;
}
