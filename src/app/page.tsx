import PageClient from "@app/PageClient";
import { getUsers, getTasks, getSubmissions, getRewards } from "@lib/dynamoDbApi";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [users, tasks, submissions, rewards] = await Promise.all([
    getUsers(),
    getTasks(),
    getSubmissions(),
    getRewards(),
  ]);

  return <PageClient users={users} tasks={tasks} submissions={submissions} rewards={rewards} />;
}
