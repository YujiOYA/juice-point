"use client";
import Link from "next/link";
import { useState } from "react";

import Card from "@atom/Card";
import LoginForm from "@organism/LoginForm";
import TaskForm from "@organism/TaskForm";
import { useSubmissions } from "@hook/useSubmissions";
import { Reward } from "@type/reward";
import { Submission } from "@type/submission";
import { Task } from "@type/task";
import { User } from "@type/user";

interface Props {
  users: User[];
  tasks: Task[];
  submissions: Submission[];
  rewards: Reward[];
}

export default function PageClient({ users, tasks, submissions: initialSubmissions, rewards }: Props) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const { submissions, refreshSubmissions } = useSubmissions(initialSubmissions);

  const isAdmin = loggedInUser?.authority === "admin";

  return (
    <div className="container">
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
        <Link href="/admin">
          <button className="submit-button">🛠 管理画面へ</button>
        </Link>
      )}
      {loggedInUser && !isAdmin && (
        <Card>
          <TaskForm user={loggedInUser} tasks={tasks} submissions={submissions} rewards={rewards} onRefresh={refreshSubmissions} />
        </Card>
      )}
    </div>
  );
}
