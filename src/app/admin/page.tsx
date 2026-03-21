import Link from "next/link";

import { getRewards, getTasks, getUsers } from "@lib/dynamoDbApi";
import RewardManagerClient from "./RewardManagerClient";
import TaskManagerClient from "./TaskManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [users, tasks, rewards] = await Promise.all([getUsers(), getTasks(), getRewards()]);
  return (
    <div className="task-admin-wrap">
      <Link href="/">
        <button className="logout-button" style={{ marginBottom: "1rem" }}>← 戻る</button>
      </Link>
      <h1 style={{ marginBottom: "2rem" }}>🛠 管理画面</h1>

      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ marginBottom: "1.5rem" }}>📋 タスク管理</h2>
        <TaskManagerClient users={users} initialTasks={tasks} />
      </section>

      <section>
        <h2 style={{ marginBottom: "1.5rem" }}>🎁 報酬管理</h2>
        <RewardManagerClient initialRewards={rewards} />
      </section>
    </div>
  );
}
