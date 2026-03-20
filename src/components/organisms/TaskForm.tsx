"use client";
import { useState } from "react";

import Button from "@/components/atoms/Button";
import SelectInput from "@/components/atoms/SelectInput";
import TextInput from "@/components/atoms/TextInput";
import FormField from "@/components/molecules/FormField";
import { Task } from "@/types/task";
import { User } from "@/types/user";

interface Props {
  user: User;
  tasks: Task[];
}

export default function TaskForm({ user, tasks }: Props) {
  const [point, setPoint] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTasks = tasks.filter((t) => t.whose === user.user);

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

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        ✅ 申請する
      </Button>
    </form>
  );
}
