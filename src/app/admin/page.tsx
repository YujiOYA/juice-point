import AdminLogoutButton from "@app/admin/AdminLogoutButton";
import RewardManagerClient from "@app/admin/RewardManagerClient";
import SubmissionManagerClient from "@app/admin/SubmissionManagerClient";
import TaskManagerClient from "@app/admin/TaskManagerClient";
import UserManagerClient from "@app/admin/UserManagerClient";
import Tabs from "@atom/Tabs";
import { getRewards, getSubmissions, getTasks, getUsers } from "@lib/dynamoDbApi";
import PushNotificationToggle from "@organism/PushNotificationToggle";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
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
