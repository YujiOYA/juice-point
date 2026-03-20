import React, { useState } from "react";

import { User } from "../types/api/user";
import { Task } from "../types/api/task";

interface TaskFormProps {
  user: User;
  tasks: Task[];
}

export default function TaskForm({ user, tasks }: TaskFormProps) {
  const [point, setPoint] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTasks = tasks.filter((t) => t.whose === user.user);

  function handleOnChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const task = tasks.find((t) => t.id === e.target.value) || null;
    setSelectedTask(task);
    setPoint(task?.point ?? "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedTask) {
      alert("タスクを選択してください");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "register",
          whatYouDid: selectedTask.task,
          point: selectedTask.point,
          whoDid: user.user,
        }),
      });
      if (!response.ok) throw new Error("Failed");
      alert("申請しました！");
    } catch {
      alert("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
      location.reload();
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div>
        <label className="task-label" htmlFor="task">
          🎯 タスクを<ruby>選<rt>えら</rt></ruby>んでね
        </label>
        <select
          id="task"
          name="task"
          onChange={handleOnChangeSelect}
          className="input"
          defaultValue=""
        >
          <option value="" disabled>
            タスクを選んでね！
          </option>
          {userTasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.task}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="task-label" htmlFor="points">
          💰 もらえるポイント
        </label>
        <input
          type="number"
          id="points"
          name="points"
          value={point}
          readOnly
          className="input highlight"
        />
      </div>

      <button className="submit-button" disabled={isSubmitting}>
        ✅ <ruby>申請<rt>しんせい</rt></ruby>する
      </button>
    </form>
  );
}
