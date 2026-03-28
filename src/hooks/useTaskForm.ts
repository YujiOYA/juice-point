import { useState } from "react";
import { toast } from "sonner";

import { Reward } from "@type/reward";
import { Submission } from "@type/submission";
import { Task } from "@type/task";
import { User } from "@type/user";

export function useTaskForm(
  user: User,
  tasks: Task[],
  submissions: Submission[],
  rewards: Reward[],
  onRefresh: () => Promise<void>,
) {
  const [point, setPoint] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
  const [requestTaskName, setRequestTaskName] = useState("");
  const [requestPoint, setRequestPoint] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);

  const userTasks = tasks.filter((t) => t.whose === user.id);
  const userRewards = rewards.filter((r) => r.whose === user.id).sort((a, b) => Number(a.point) - Number(b.point));

  const userPoint = submissions
    .filter((s) => s.whoDid === user.id && s.status === "承認")
    .reduce((sum, s) => sum + (Number(s.point) || 0), 0);

  const handleChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const task = tasks.find((t) => t.id === e.target.value) ?? null;
    setSelectedTask(task);
    setPoint(task?.point ?? "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTask) {
      toast.warning("タスクを選択してください");
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
          whoDid: user.id,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmittedTaskIds((prev) => new Set(prev).add(selectedTask.id));
      await onRefresh();
      toast.success("申請しました！🎉");
    } catch {
      toast.error("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsePoints = async (reward: Reward) => {
    if (userPoint < Number(reward.point)) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "usePoints", userId: user.id, point: Number(reward.point) }),
      });
      if (!res.ok) throw new Error("Failed");
      await onRefresh();
      toast.success(`🎁 ${reward.name}と交換しました！`);
    } catch {
      toast.error("交換に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestSubmit = async () => {
    if (!requestTaskName.trim() || !requestPoint) {
      toast.warning("タスク名とポイントを入力してください");
      return;
    }
    setIsRequesting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "requestTask",
          whatYouDid: requestTaskName.trim(),
          point: requestPoint,
          whoDid: user.id,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setRequestTaskName("");
      setRequestPoint("");
      toast.success("タスクをリクエストしました！");
    } catch {
      toast.error("リクエストに失敗しました");
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    point,
    selectedTask,
    isSubmitting,
    submittedTaskIds,
    userTasks,
    userPoint,
    rewards: userRewards,
    requestTaskName,
    requestPoint,
    isRequesting,
    setRequestTaskName,
    setRequestPoint,
    handleChangeSelect,
    handleSubmit,
    handleUsePoints,
    handleRequestSubmit,
  };
}
