"use client";
import Link from "next/link";
import { useState } from "react";

import Card from "@atom/Card";
import LoginForm from "@organism/LoginForm";
import ManagerPanel from "@organism/ManagerPanel";
import TaskForm from "@organism/TaskForm";
import { useSubmissions } from "@hook/useSubmissions";
import { Submission } from "@type/submission";
import { Task } from "@type/task";
import { User } from "@type/user";

interface Props {
  users: User[];
  tasks: Task[];
  submissions: Submission[];
}

export default function PageClient({ users, tasks, submissions: initialSubmissions }: Props) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const { submissions, refreshSubmissions } = useSubmissions(initialSubmissions);

  const isAdmin = loggedInUser?.authority === "admin";

  return (
    <div className={`container${isAdmin ? " container--wide" : ""}`}>
      <h1 className="page-title">⭐ ポイント管理アプリ ⭐</h1>
      <Card>
        <LoginForm
          users={users}
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
          submissions={submissions}
        />
      </Card>
      {loggedInUser && isAdmin && (
        <>
          <Card>
            <ManagerPanel submissions={submissions} onRefresh={refreshSubmissions} />
          </Card>
          <Link href="/admin">
            <button className="logout-button">🛠 タスク管理</button>
          </Link>
        </>
      )}
      {loggedInUser && !isAdmin && (
        <Card>
          <TaskForm user={loggedInUser} tasks={tasks} submissions={submissions} onRefresh={refreshSubmissions} />
        </Card>
      )}
    </div>
  );
}
