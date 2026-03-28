"use client";

import Button from "@atom/Button";
import SelectInput from "@atom/SelectInput";
import Tabs from "@atom/Tabs";
import TextInput from "@atom/TextInput";
import FormField from "@molecule/FormField";
import { useState } from "react";
import { useTaskForm } from "@hook/useTaskForm";
import { Reward } from "@type/reward";
import { Submission, SubmissionType } from "@type/submission";
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
  const [pendingOpen, setPendingOpen] = useState(false);
  const [pendingRequestOpen, setPendingRequestOpen] = useState(false);
  const {
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
    registerTaskAlso,
    setRequestTaskName,
    setRequestPoint,
    setRegisterTaskAlso,
    handleChangeSelect,
    handleSubmit,
    handleUsePoints,
    handleRequestSubmit,
  } = useTaskForm(user, tasks, submissions, rewards, onRefresh);

  const userPending = submissions.filter((s) => s.whoDid === user.id && s.status === "未承認");
  const pendingSubmit  = userPending.filter((s) => s.submissionType !== SubmissionType.TaskRequest);
  const pendingRequest = userPending.filter((s) => s.submissionType === SubmissionType.TaskRequest);

  const tabSubmit = (
    <form onSubmit={handleSubmit}>
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
        style={{ marginTop: "16px" }}
      >
        ✅ 申請する
      </Button>

      {pendingSubmit.length > 0 && (
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
          <button
            type="button"
            onClick={() => setPendingOpen((o) => !o)}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", color: "#757575", width: "100%" }}
          >
            <span style={{ display: "inline-block", transition: "transform 0.2s", transform: pendingOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
            ⏳ 承認待ち（{pendingSubmit.length}件）
          </button>
          <div style={{ overflow: "hidden", maxHeight: pendingOpen ? "500px" : "0", transition: "max-height 0.3s ease" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {pendingSubmit.map((s) => (
                <li key={s.id} style={{ display: "flex", justifyContent: "space-between", color: "#444" }}>
                  <span style={{ textAlign: "left" }}>{s.whatYouDid}</span>
                  <span style={{ color: "#f59e0b", fontWeight: "bold", marginLeft: "0.5rem" }}>{s.point}pt</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </form>
  );

  const tabRequest = (
    <div>
      <FormField label="タスク名" htmlFor="requestTaskName">
        <TextInput
          id="requestTaskName"
          name="requestTaskName"
          type="text"
          value={requestTaskName}
          onChange={(e) => setRequestTaskName(e.target.value)}
          placeholder="例: 🧺洗濯物をたたむ"
        />
      </FormField>
      <FormField label="希望ポイント" htmlFor="requestPoint">
        <TextInput
          id="requestPoint"
          name="requestPoint"
          type="number"
          value={requestPoint}
          onChange={(e) => setRequestPoint(e.target.value)}
          onBlur={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) setRequestPoint(String(v)); }}
          placeholder="例: 1.5"
          step={0.5}
          min={0}
        />
      </FormField>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", cursor: "pointer", color: "#555" }}>
        <input
          type="checkbox"
          checked={registerTaskAlso}
          onChange={(e) => setRegisterTaskAlso(e.target.checked)}
        />
        タスクとして登録もリクエストする
      </label>
      <Button
        type="button"
        variant="primary"
        disabled={isRequesting || !requestTaskName.trim() || !requestPoint}
        onClick={handleRequestSubmit}
        style={{ marginTop: "1rem" }}
      >
        ✅ 申請する
      </Button>

      {pendingRequest.length > 0 && (
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
          <button
            type="button"
            onClick={() => setPendingRequestOpen((o) => !o)}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", color: "#757575", width: "100%" }}
          >
            <span style={{ display: "inline-block", transition: "transform 0.2s", transform: pendingRequestOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
            ⏳ 承認待ち（{pendingRequest.length}件）
          </button>
          <div style={{ overflow: "hidden", maxHeight: pendingRequestOpen ? "500px" : "0", transition: "max-height 0.3s ease" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {pendingRequest.map((s) => (
                <li key={s.id} style={{ display: "flex", justifyContent: "space-between", color: "#444" }}>
                  <span style={{ textAlign: "left" }}>{s.whatYouDid}</span>
                  <span style={{ color: "#f59e0b", fontWeight: "bold", marginLeft: "0.5rem" }}>{s.point}pt</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const tabRewards = (
    <div>
      <p style={{ marginBottom: "0.75rem" }}>💰 現在のポイント: <strong>{userPoint}pt</strong></p>
      {userRewards.length > 0 ? (
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
      ) : (
        <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>交換できる報酬がありません</p>
      )}
    </div>
  );

  return (
    <div className="task-form">
      <Tabs
        items={[
          { id: "submit",  label: "✅ タスク完了", content: tabSubmit },
          { id: "request", label: "📝 新規タスク追加", content: tabRequest },
          { id: "rewards", label: "🎁 ポイント交換", content: tabRewards },
        ]}
      />
    </div>
  );
}
