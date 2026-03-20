import { getUsers, getTasks, getSubmissions } from "src/dynamoDbApi";

import PageClient from "./PageClient";

export default async function Page() {
  const [users, tasks, submissions] = await Promise.all([
    getUsers(),
    getTasks(),
    getSubmissions(),
  ]);

  return (
    <PageClient
      users={users}
      tasks={tasks}
      submissions={submissions}
    />
  );
}
