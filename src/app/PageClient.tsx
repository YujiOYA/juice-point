"use client";
import { useState } from "react";

import { User } from "../types/api/user";
import { Task } from "../types/api/task";
import { Submission } from "../types/api/submission";
import Login from "../components/Login";
import TaskForm from "../components/TaskForm";
import Manager from "../components/Manager";

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
        <Login
          users={users}
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
          submissions={submissions}
        />
      </div>
      {loggedInUser && isAdmin && (
        <div className="card">
          <Manager submissions={submissions} />
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
