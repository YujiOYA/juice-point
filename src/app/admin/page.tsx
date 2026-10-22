import { redirect } from "next/navigation";

import AdminLogoutButton from "@app/admin/AdminLogoutButton";
import RewardManagerClient from "@app/admin/RewardManagerClient";
import SubmissionManagerClient from "@app/admin/SubmissionManagerClient";
import TaskManagerClient from "@app/admin/TaskManagerClient";
import UserManagerClient from "@app/admin/UserManagerClient";
import Tabs from "@atom/Tabs";
import { AUTHORITY } from "@const/constDefinition";
import { getSessionUser } from "@lib/authGuard";
import { getRewards, getSubmissions, getTasks, getUsers } from "@lib/dynamoDbApi";
import PushNotificationToggle from "@organism/PushNotificationToggle";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    // middleware に加え、DB 上の最新の権限でも確認する（権限を外されたユーザーの古いセッション対策）
    const sessionUser = await getSessionUser();
    if (sessionUser?.authority !== AUTHORITY.admin) redirect("/");

    const [users, tasks, rewards, submissions] = await Promise.all([
        getUsers(),
        getTasks(),
        getRewards(),
        getSubmissions(),
    ]);
    const nonAdminUsers = users.filter((u) => u.authority !== "admin");
    return (
        <div className="task-admin-wrap">
            <div style={{ marginBottom: "1rem" }}>
                <AdminLogoutButton />
            </div>
            <h1 style={{ marginBottom: "1rem" }}>🛠 管理画面</h1>
            <PushNotificationToggle />

            <Tabs
                items={[
                    {
                        id: "submissions",
                        label: "📋 申請管理",
                        content: <SubmissionManagerClient initialSubmissions={submissions} users={users} />,
                    },
                    {
                        id: "tasks",
                        label: "🔧 タスク管理",
                        content: <TaskManagerClient users={nonAdminUsers} initialTasks={tasks} />,
                    },
                    {
                        id: "rewards",
                        label: "🎁 報酬管理",
                        content: <RewardManagerClient users={nonAdminUsers} initialRewards={rewards} />,
                    },
                    { id: "users", label: "👤 ユーザー管理", content: <UserManagerClient initialUsers={users} /> },
                ]}
            />
        </div>
    );
}
