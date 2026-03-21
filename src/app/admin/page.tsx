import Link from "next/link";

import { getRewards, getSubmissions, getTasks, getUsers } from "@lib/dynamoDbApi";
import Tabs from "@atom/Tabs";
import RewardManagerClient from "./RewardManagerClient";
import SubmissionManagerClient from "./SubmissionManagerClient";
import TaskManagerClient from "./TaskManagerClient";
import UserManagerClient from "./UserManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [users, tasks, rewards, submissions] = await Promise.all([getUsers(), getTasks(), getRewards(), getSubmissions()]);
  return (
    <div className="task-admin-wrap">
      <Link href="/">
        <button className="logout-button" style={{ marginBottom: "1rem" }}>← 戻る</button>
      </Link>
      <h1 style={{ marginBottom: "1.5rem" }}>🛠 管理画面</h1>

      <Tabs
        items={[
          { id: "submissions", label: "📋 申請管理", content: <SubmissionManagerClient initialSubmissions={submissions} /> },
          { id: "tasks",       label: "🔧 タスク管理", content: <TaskManagerClient users={users} initialTasks={tasks} /> },
          { id: "rewards",     label: "🎁 報酬管理",   content: <RewardManagerClient users={users} initialRewards={rewards} /> },
          { id: "users",       label: "👤 ユーザー管理", content: <UserManagerClient initialUsers={users} /> },
        ]}
      />
    </div>
  );
}
