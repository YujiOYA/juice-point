"use client";

import Button from "@atom/Button";
import SelectInput from "@atom/SelectInput";
import TextInput from "@atom/TextInput";
import FormField from "@molecule/FormField";
import { useTaskForm } from "@hook/useTaskForm";
import { Reward } from "@type/reward";
import { Submission } from "@type/submission";
import { Task } from "@type/task";
import { User } from "@type/user";

interface Props {
  user: User;
  tasks: Task[];
  submissions: Submission[];
  rewards: Reward[];
  onRefresh: () => Promise<void>;
}

export default function TaskForm({ user, tasks, submissions, rewards = [], onRefresh }: Props) {
  const {
    point,
    selectedTask,
    isSubmitting,
    submittedTaskIds,
    userTasks,
    userPoint,
    rewards: userRewards,
    handleChangeSelect,
    handleSubmit,
    handleUsePoints,
  } = useTaskForm(user, tasks, submissions, rewards, onRefresh);

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
        disabled={isSubmitting || !selectedTask || submittedTaskIds.has(selectedTask.id)}
      >
        ✅ 申請する
      </Button>

      {(() => {
        const pending = submissions.filter((s) => s.whoDid === user.id && s.status === "未承認");
        if (pending.length === 0) return null;
        return (
          <details style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
            <summary style={{ fontSize: "13px", color: "#757575", cursor: "pointer", userSelect: "none" }}>
              ⏳ 承認待ち（{pending.length}件）
            </summary>
            <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {pending.map((s) => (
                <li key={s.id} style={{ fontSize: "13px", display: "flex", justifyContent: "space-between", color: "#444" }}>
                  <span>{s.whatYouDid}</span>
                  <span style={{ color: "#f59e0b", fontWeight: "bold", marginLeft: "0.5rem" }}>{s.point}pt</span>
                </li>
              ))}
            </ul>
          </details>
        );
      })()}

      <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1.5rem" }}>
        <p style={{ marginBottom: "0.75rem" }}>💰 現在のポイント: <strong>{userPoint}pt</strong></p>
        {userRewards.length > 0 && (
          <>
            <p style={{ fontSize: "14px", color: "#757575", marginBottom: "0.75rem" }}>🎁 交換できる報酬</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {userRewards.map((reward) => (
                <Button
                  key={reward.id}
                  variant="approve"
                  disabled={isSubmitting || userPoint < Number(reward.point)}
                  onClick={() => handleUsePoints(reward)}
                >
                  {reward.name}（{reward.point}pt）と交換する
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </form>
  );
}
