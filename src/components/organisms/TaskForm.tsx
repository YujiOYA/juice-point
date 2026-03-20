"use client";

import Button from "@/components/atoms/Button";
import SelectInput from "@/components/atoms/SelectInput";
import TextInput from "@/components/atoms/TextInput";
import FormField from "@/components/molecules/FormField";
import { useTaskForm } from "@/hooks/useTaskForm";
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
  const {
    point,
    selectedTask,
    isSubmitting,
    submittedTaskIds,
    userTasks,
    userPoint,
    handleChangeSelect,
    handleSubmit,
    handleBuyJuice,
  } = useTaskForm(user, tasks, submissions, onRefresh);

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <FormField label="🎯 タスクをえらんでね" htmlFor="task">
        <SelectInput id="task" defaultValue="" onChange={handleChangeSelect}>
          <option value="" disabled>タスクを選んでね！</option>
          {userTasks.map((t) => (
            <option key={t.id} value={t.id}>{t.task}</option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label="💰 もらえるポイント" htmlFor="points">
        <TextInput id="points" name="points" type="number" value={point} readOnly className="input highlight" />
      </FormField>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || (!!selectedTask && submittedTaskIds.has(selectedTask.id))}
      >
        ✅ 申請する
      </Button>

      <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem" }}>
        <p style={{ marginBottom: "0.5rem" }}>💰 現在のポイント: <strong>{userPoint}pt</strong></p>
        <Button variant="approve" disabled={isSubmitting || userPoint < 10} onClick={handleBuyJuice}>
          🧃 ジュースと交換する（10pt）
        </Button>
      </div>
    </form>
  );
}
