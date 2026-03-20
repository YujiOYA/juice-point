import PageClient from "@/app/PageClient";
import { getUsers, getTasks, getSubmissions } from "@/lib/dynamoDbApi";

export default async function Page() {
  const [users, tasks, submissions] = await Promise.all([
    getUsers(),
    getTasks(),
    getSubmissions(),
  ]);

  return <PageClient users={users} tasks={tasks} submissions={submissions} />;
}
