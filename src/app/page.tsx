// src/app/page.tsx

import { getUsers } from "src/dynamoDbApi";

import PageClient from "./PageClient";

export default async function Page() {
  const [users] = await Promise.all([
    getUsers(),
  ]);

  return (
    <PageClient
      users={users}
    />
  );
}
