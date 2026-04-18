"use client";
import { useState } from "react";

import Card from "@atom/Card";
import LoginForm from "@organism/LoginForm";
import TaskForm from "@organism/TaskForm";
import { useSubmissions } from "@hook/queries/useSubmissions";
import { Reward } from "@type/reward";
import { Submission } from "@type/submission";
import { Task } from "@type/task";
import { User } from "@type/user";
import { AUTHORITY } from "@const/constDefinition";
import { LABELS } from "@const/labels";

interface Props {
  users: User[];
  tasks: Task[];
  submissions: Submission[];
  rewards: Reward[];
}

export default function PageClient({ users, tasks, submissions: initialSubmissions, rewards }: Props) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const { data: submissions = [] } = useSubmissions(initialSubmissions);

  const isAdmin = loggedInUser?.authority === AUTHORITY.admin;

  return (
    <div className="container">
      <h1 className="page-title">{LABELS.app.title}</h1>
      <Card>
        <LoginForm
          users={users}
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
          submissions={submissions}
        />
      </Card>
      {loggedInUser && !isAdmin && (
        <Card>
          <TaskForm
            user={loggedInUser}
            initialTasks={tasks}
            initialSubmissions={initialSubmissions}
            initialRewards={rewards}
          />
        </Card>
      )}
    </div>
  );
}
