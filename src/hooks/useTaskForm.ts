import { useState } from "react";

import { Submission } from "@type/submission";
import { Task } from "@type/task";
import { User } from "@type/user";

export function useTaskForm(
  user: User,
  tasks: Task[],
  submissions: Submission[],
  onRefresh: () => Promise<void>,
) {
  const [point, setPoint] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());

  const userTasks = tasks.filter((t) => t.whose === user.user);

  const userPoint = submissions
    .filter((s) => s.whoDid === user.user && s.status === "承認" && s.isUsed === "未使用")
    .reduce((sum, s) => sum + (Number(s.point) || 0), 0);

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const task = tasks.find((t) => t.id === e.target.value) ?? null;
    setSelectedTask(task);
    setPoint(task?.point ?? "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTask) {
      alert("タスクを選択してください");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "register",
          whatYouDid: selectedTask.task,
          point: selectedTask.point,
          whoDid: user.user,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmittedTaskIds((prev) => new Set(prev).add(selectedTask.id));
      await onRefresh();
      alert("申請しました！");
    } catch {
      alert("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyJuice = async () => {
    if (userPoint < 10) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "usePoints", userId: user.user }),
      });
      if (!res.ok) throw new Error("Failed");
      await onRefresh();
      alert("🧃 ジュースと交換しました！");
    } catch {
      alert("交換に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    point,
    selectedTask,
    isSubmitting,
    submittedTaskIds,
    userTasks,
    userPoint,
    handleChangeSelect,
    handleSubmit,
    handleBuyJuice,
  };
}
