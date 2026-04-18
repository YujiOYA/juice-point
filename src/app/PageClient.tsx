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
  sessionUser: User | null;
  next?: string | null;
}

export default function PageClient({ users, tasks, submissions: initialSubmissions, rewards, sessionUser, next }: Props) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(sessionUser);
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
          next={next}
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
