import { useState } from "react";
import { toast } from "sonner";

import { useTasks } from "@hook/queries/useTasks";
import { useSubmissions, useSubmissionMutations } from "@hook/queries/useSubmissions";
import { useRewards } from "@hook/queries/useRewards";
import { Reward } from "@type/reward";
import { Submission } from "@type/submission";
import { Task } from "@type/task";
import { User } from "@type/user";

export function useTaskForm(
  user: User,
  initialTasks: Task[],
  initialSubmissions: Submission[],
  initialRewards: Reward[],
) {
  const { data: tasks = [] } = useTasks(initialTasks);
  const { data: submissions = [] } = useSubmissions(initialSubmissions);
  const { data: rewards = [] } = useRewards(initialRewards);
  const mutations = useSubmissionMutations();

  const [point, setPoint] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
  const [requestTaskName, setRequestTaskName] = useState("");
  const [requestPoint, setRequestPoint] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [registerTaskAlso, setRegisterTaskAlso] = useState(false);

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
      await mutations.register.mutateAsync({
        whatYouDid: selectedTask.task,
        point: selectedTask.point,
        whoDid: user.id,
      });
      setSubmittedTaskIds((prev) => new Set(prev).add(selectedTask.id));
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
      await mutations.usePoints.mutateAsync({ userId: user.id, point: Number(reward.point) });
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
      const ops: Promise<unknown>[] = [
        mutations.registerOneTimeTask.mutateAsync({
          whatYouDid: requestTaskName.trim(),
          point: requestPoint,
          whoDid: user.id,
        }),
      ];
      if (registerTaskAlso) {
        ops.push(
          mutations.requestTask.mutateAsync({
            whatYouDid: requestTaskName.trim(),
            point: requestPoint,
            whoDid: user.id,
          }),
        );
      }
      await Promise.all(ops);
      setRequestTaskName("");
      setRequestPoint("");
      setRegisterTaskAlso(false);
      toast.success(registerTaskAlso ? "申請とタスク登録リクエストを送りました！" : "申請しました！");
    } catch {
      toast.error("申請に失敗しました");
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
    registerTaskAlso,
    setRequestTaskName,
    setRequestPoint,
    setRegisterTaskAlso,
    handleChangeSelect,
    handleSubmit,
    handleUsePoints,
    handleRequestSubmit,
  };
}
