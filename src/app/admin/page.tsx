import { getTasks, getUsers } from "@lib/dynamoDbApi";
import TaskManagerClient from "./TaskManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [users, tasks] = await Promise.all([getUsers(), getTasks()]);
  return <TaskManagerClient users={users} tasks={tasks} />;
}
