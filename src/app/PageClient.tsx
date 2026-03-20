"use client";
import { useState } from "react";

import LoginForm from "@/components/organisms/LoginForm";
import ManagerPanel from "@/components/organisms/ManagerPanel";
import TaskForm from "@/components/organisms/TaskForm";
import { Submission } from "@/types/submission";
import { Task } from "@/types/task";
import { User } from "@/types/user";

interface Props {
  users: User[];
  tasks: Task[];
  submissions: Submission[];
}

export default function PageClient({ users, tasks, submissions }: Props) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

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
        <div className="card">
          <ManagerPanel submissions={submissions} />
        </div>
      )}
      {loggedInUser && !isAdmin && (
        <div className="card">
          <TaskForm user={loggedInUser} tasks={tasks} />
        </div>
      )}
    </div>
  );
}
