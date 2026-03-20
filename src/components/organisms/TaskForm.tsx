"use client";
import { useState } from "react";

import Button from "@/components/atoms/Button";
import SelectInput from "@/components/atoms/SelectInput";
import TextInput from "@/components/atoms/TextInput";
import FormField from "@/components/molecules/FormField";
import { Submission } from "@/types/submission";
import { Task } from "@/types/task";
import { User } from "@/types/user";

interface Props {
  user: User;
  tasks: Task[];
  submissions: Submission[];
  onRefresh: () => Promise<void>;
}

export default function TaskForm({ user, tasks, submissions, onRefresh }: Props) {
  const [point, setPoint] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());

  const userTasks = tasks.filter((t) => t.whose === user.user);

  const userPoint = submissions
    .filter((s) => s.whoDid === user.user && s.status === "承認" && s.isUsed === "未使用")
    .reduce((sum, s) => sum + (Number(s.point) || 0), 0);

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

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <FormField
        label="🎯 タスクをえらんでね"
        htmlFor="task"
      >
        <SelectInput id="task" defaultValue="" onChange={handleChangeSelect}>
          <option value="" disabled>
            タスクを選んでね！
          </option>
          {userTasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.task}
            </option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label="💰 もらえるポイント" htmlFor="points">
        <TextInput
          id="points"
          name="points"
          type="number"
          value={point}
          readOnly
          className="input highlight"
        />
      </FormField>

      <Button type="submit" variant="primary" disabled={isSubmitting || (!!selectedTask && submittedTaskIds.has(selectedTask.id))}>
        ✅ 申請する
      </Button>

      <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem" }}>
        <p style={{ marginBottom: "0.5rem" }}>💰 現在のポイント: <strong>{userPoint}pt</strong></p>
        <Button
          variant="approve"
          disabled={isSubmitting || userPoint < 10}
          onClick={handleBuyJuice}
        >
          🧃 ジュースと交換する（10pt）
        </Button>
      </div>
    </form>
  );
}
