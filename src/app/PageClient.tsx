"use client";
import Link from "next/link";
import { useState } from "react";

import LoginForm from "@/components/organisms/LoginForm";
import ManagerPanel from "@/components/organisms/ManagerPanel";
import TaskForm from "@/components/organisms/TaskForm";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Submission } from "@/types/submission";
import { Task } from "@/types/task";
import { User } from "@/types/user";

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
      <div className="card">
        <LoginForm
          users={users}
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
          submissions={submissions}
        />
      </div>
      {loggedInUser && isAdmin && (
        <>
          <div className="card">
            <ManagerPanel submissions={submissions} onRefresh={refreshSubmissions} />
          </div>
          <Link href="/admin">
            <button className="logout-button">🛠 タスク管理</button>
          </Link>
        </>
      )}
      {loggedInUser && !isAdmin && (
        <div className="card">
          <TaskForm user={loggedInUser} tasks={tasks} submissions={submissions} onRefresh={refreshSubmissions} />
        </div>
      )}
    </div>
  );
}
