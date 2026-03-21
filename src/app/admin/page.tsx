import Link from "next/link";

import { getRewards, getTasks, getUsers } from "@lib/dynamoDbApi";
import Tabs from "@atom/Tabs";
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
      <h1 style={{ marginBottom: "1.5rem" }}>🛠 管理画面</h1>

      <Tabs
        items={[
          { id: "tasks",   label: "📋 タスク管理", content: <TaskManagerClient users={users} initialTasks={tasks} /> },
          { id: "rewards", label: "🎁 報酬管理",   content: <RewardManagerClient initialRewards={rewards} /> },
        ]}
      />
    </div>
  );
}
