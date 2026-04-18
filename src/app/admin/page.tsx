import Link from "next/link";

import { getRewards, getSubmissions, getTasks, getUsers } from "@lib/dynamoDbApi";
import Tabs from "@atom/Tabs";
import PushNotificationToggle from "@organism/PushNotificationToggle";
import RewardManagerClient from "./RewardManagerClient";
import SubmissionManagerClient from "./SubmissionManagerClient";
import TaskManagerClient from "./TaskManagerClient";
import UserManagerClient from "./UserManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [users, tasks, rewards, submissions] = await Promise.all([getUsers(), getTasks(), getRewards(), getSubmissions()]);
  const nonAdminUsers = users.filter((u) => u.authority !== "admin");
  return (
    <div className="task-admin-wrap">
      <Link href="/">
        <button className="logout-button" style={{ marginBottom: "1rem" }}>← 戻る</button>
      </Link>
      <h1 style={{ marginBottom: "1rem" }}>🛠 管理画面</h1>
      <PushNotificationToggle />

      <Tabs
        items={[
          { id: "submissions", label: "📋 申請管理", content: <SubmissionManagerClient initialSubmissions={submissions} users={users} /> },
          { id: "tasks",       label: "🔧 タスク管理", content: <TaskManagerClient users={nonAdminUsers} initialTasks={tasks} /> },
          { id: "rewards",     label: "🎁 報酬管理",   content: <RewardManagerClient users={nonAdminUsers} initialRewards={rewards} /> },
          { id: "users",       label: "👤 ユーザー管理", content: <UserManagerClient initialUsers={users} /> },
        ]}
      />
    </div>
  );
}
