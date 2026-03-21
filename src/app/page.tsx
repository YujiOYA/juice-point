import PageClient from "@app/PageClient";
import InitialSetupClient from "@app/InitialSetupClient";
import { getUsers, getTasks, getSubmissions, getRewards } from "@lib/dynamoDbApi";

export const dynamic = "force-dynamic";

export default async function Page() {
  const users = await getUsers();

  if (users.length === 0) {
    return <InitialSetupClient />;
  }

  const [tasks, submissions, rewards] = await Promise.all([
    getTasks(),
    getSubmissions(),
    getRewards(),
  ]);

  return <PageClient users={users} tasks={tasks} submissions={submissions} rewards={rewards} />;
}
