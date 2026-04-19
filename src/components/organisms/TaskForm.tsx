"use client";

import Button from "@atom/Button";
import SelectInput from "@atom/SelectInput";
import Tabs from "@atom/Tabs";
import TextInput from "@atom/TextInput";
import FormField from "@molecule/FormField";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTaskForm } from "@hook/useTaskForm";
import { useSubmissions } from "@hook/queries/useSubmissions";
import { Reward } from "@type/reward";
import { Submission, SubmissionType } from "@type/submission";
import { Task } from "@type/task";
import { User } from "@type/user";
import { SUBMISSION_STATUS } from "@const/constDefinition";
import { API } from "@const/apiEndpoint";
import { LABELS } from "@const/labels";

const L = LABELS.taskForm;

interface Props {
  user: User;
  initialTasks: Task[];
  initialSubmissions: Submission[];
  initialRewards: Reward[];
}

export default function TaskForm({ user, initialTasks, initialSubmissions, initialRewards }: Props) {
  const [pendingOpen, setPendingOpen] = useState(false);
  const [pendingRequestOpen, setPendingRequestOpen] = useState(false);
  const { data, taskForm, requestForm, isSubmitting, isRequesting, handleUsePoints } =
    useTaskForm(user, initialTasks, initialSubmissions, initialRewards);
  const { userTasks, userPoint, rewards: userRewards, submittedTaskIds } = data;
  const { selectedTask, point, onChange: handleChangeSelect, onSubmit: handleSubmit } = taskForm;
  const {
    taskName: requestTaskName,
    point: requestPoint,
    registerTaskAlso,
    setTaskName: setRequestTaskName,
    setPoint: setRequestPoint,
    setRegisterTaskAlso,
    onSubmit: handleRequestSubmit,
  } = requestForm;

  const { data: submissions = [] } = useSubmissions(initialSubmissions);
  const userPending = submissions.filter((s) => s.whoDid === user.id && s.status === SUBMISSION_STATUS.pending);
  const pendingSubmit  = userPending.filter((s) => s.submissionType !== SubmissionType.TaskRequest);
  const pendingRequest = userPending.filter((s) => s.submissionType === SubmissionType.TaskRequest);

  // リマインド送信済みIDを5秒間保持（連打防止）
  const [remindedIds, setRemindedIds] = useState<Set<string>>(new Set());
  const handleRemind = useCallback(async (s: Submission) => {
    if (remindedIds.has(s.id)) return;
    setRemindedIds((prev) => new Set(prev).add(s.id));
    try {
      const res = await fetch(API.submissions.path, {
        method: API.submissions.method.POST,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "remind", id: s.id, whatYouDid: s.whatYouDid, point: s.point, whoDidName: user.user, submissionType: s.submissionType }),
      });
      if (res.ok) toast.success(LABELS.toast.remindSuccess);
      else toast.error(LABELS.toast.remindError);
    } catch {
      toast.error(LABELS.toast.remindError);
    }
    setTimeout(() => setRemindedIds((prev) => { const next = new Set(prev); next.delete(s.id); return next; }), 5000);
  }, [remindedIds, user.user]);

  const tabSubmit = (
    <form onSubmit={handleSubmit}>
      <FormField label={L.labelTask} htmlFor="task">
        <SelectInput id="task" defaultValue="" onChange={handleChangeSelect}>
          <option value="" disabled>{L.placeholderTask}</option>
          {userTasks.map((t) => (
            <option key={t.id} value={t.id}>{t.task}</option>
          ))}
        </SelectInput>
      </FormField>

      <FormField label={L.labelPoints} htmlFor="points">
        <TextInput id="points" name="points" type="number" value={point} readOnly className="input highlight" />
      </FormField>

      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || !selectedTask || submittedTaskIds.has(selectedTask.id)}
        style={{ marginTop: "16px" }}
      >
        {L.buttonSubmit}
      </Button>

      {pendingSubmit.length > 0 && (
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
          <button
            type="button"
            onClick={() => setPendingOpen((o) => !o)}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", color: "#757575", width: "100%" }}
          >
            <span style={{ display: "inline-block", transition: "transform 0.2s", transform: pendingOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
            {L.pendingCount(pendingSubmit.length)}
          </button>
          <div style={{ overflow: "hidden", maxHeight: pendingOpen ? "500px" : "0", transition: "max-height 0.3s ease" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {pendingSubmit.map((s) => (
                <li key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#444" }}>
                  <span style={{ textAlign: "left", flex: 1 }}>{s.whatYouDid}</span>
                  <span style={{ color: "#f59e0b", fontWeight: "bold", marginLeft: "0.5rem" }}>{s.point}pt</span>
                  <button
                    type="button"
                    onClick={() => handleRemind(s)}
                    disabled={remindedIds.has(s.id)}
                    title="リマインドを送る"
                    style={{ marginLeft: "0.5rem", background: "none", border: "none", cursor: remindedIds.has(s.id) ? "default" : "pointer", fontSize: "1rem", opacity: remindedIds.has(s.id) ? 0.4 : 1 }}
                  >
                    {remindedIds.has(s.id) ? L.remindDone : L.remind}
                  </button>
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
      <FormField label={L.labelTaskName} htmlFor="requestTaskName">
        <TextInput
          id="requestTaskName"
          name="requestTaskName"
          type="text"
          value={requestTaskName}
          onChange={(e) => setRequestTaskName(e.target.value)}
          placeholder={L.placeholderTaskName}
        />
      </FormField>
      <FormField label={L.labelRequestPoint} htmlFor="requestPoint">
        <TextInput
          id="requestPoint"
          name="requestPoint"
          type="number"
          value={requestPoint}
          onChange={(e) => setRequestPoint(e.target.value)}
          onBlur={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) setRequestPoint(String(v)); }}
          placeholder={L.placeholderRequestPoint}
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
        {L.checkboxRegisterTask}
      </label>
      <Button
        type="button"
        variant="primary"
        disabled={isRequesting || !requestTaskName.trim() || !requestPoint}
        onClick={handleRequestSubmit}
        style={{ marginTop: "1rem" }}
      >
        {L.buttonSubmit}
      </Button>

      {pendingRequest.length > 0 && (
        <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
          <button
            type="button"
            onClick={() => setPendingRequestOpen((o) => !o)}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", color: "#757575", width: "100%" }}
          >
            <span style={{ display: "inline-block", transition: "transform 0.2s", transform: pendingRequestOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
            {L.pendingCount(pendingRequest.length)}
          </button>
          <div style={{ overflow: "hidden", maxHeight: pendingRequestOpen ? "500px" : "0", transition: "max-height 0.3s ease" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: "0.5rem 0 0", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {pendingRequest.map((s) => (
                <li key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#444" }}>
                  <span style={{ textAlign: "left", flex: 1 }}>{s.whatYouDid}</span>
                  <span style={{ color: "#f59e0b", fontWeight: "bold", marginLeft: "0.5rem" }}>{s.point}pt</span>
                  <button
                    type="button"
                    onClick={() => handleRemind(s)}
                    disabled={remindedIds.has(s.id)}
                    title="リマインドを送る"
                    style={{ marginLeft: "0.5rem", background: "none", border: "none", cursor: remindedIds.has(s.id) ? "default" : "pointer", fontSize: "1rem", opacity: remindedIds.has(s.id) ? 0.4 : 1 }}
                  >
                    {remindedIds.has(s.id) ? L.remindDone : L.remind}
                  </button>
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
      <p style={{ marginBottom: "0.75rem" }}>{L.currentPoints(userPoint)}</p>
      {userRewards.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {userRewards.map((reward) => (
            <Button
              key={reward.id}
              variant="approve"
              disabled={isSubmitting || userPoint < Number(reward.point)}
              onClick={() => handleUsePoints(reward)}
            >
              {L.buttonExchange(reward.name, reward.point)}
            </Button>
          ))}
        </div>
      ) : (
        <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>{L.noRewards}</p>
      )}
    </div>
  );

  return (
    <div className="task-form">
      <Tabs
        items={[
          { id: "submit",  label: L.tabSubmit,  content: tabSubmit },
          { id: "request", label: L.tabRequest, content: tabRequest },
          { id: "rewards", label: L.tabRewards, content: tabRewards },
        ]}
      />
    </div>
  );
}
