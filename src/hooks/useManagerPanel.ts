import { useState } from "react";
import { toast } from "sonner";

import { useSubmissionMutations } from "@hook/queries/useSubmissions";
import { Submission, SubmissionType } from "@type/submission";

export function useManagerPanel(submissions: Submission[]) {
  const [isDoing, setIsDoing] = useState(false);
  const [editedPoints, setEditedPoints] = useState<Map<string, string>>(new Map());

  const getEditedPoint = (id: string, defaultPoint: string) => editedPoints.get(id) ?? defaultPoint;
  const setEditedPoint = (id: string, point: string) => {
    setEditedPoints((prev) => new Map(prev).set(id, point));
  };

  const byDateDesc = (a: Submission, b: Submission) => b.createdAt.localeCompare(a.createdAt);

  const pending = submissions.filter((s) => s.status === "未承認" && s.submissionType !== SubmissionType.TaskRequest).sort(byDateDesc);
  const rejected = submissions.filter((s) => s.status === "却下" && s.submissionType !== SubmissionType.TaskRequest).sort(byDateDesc);
  const pendingTaskRequests = submissions.filter((s) => s.status === "未承認" && s.submissionType === SubmissionType.TaskRequest).sort(byDateDesc);
  const rejectedTaskRequests = submissions.filter((s) => s.status === "却下" && s.submissionType === SubmissionType.TaskRequest).sort(byDateDesc);

  const mutations = useSubmissionMutations();

  const handleApprove = async (id: string) => {
    setIsDoing(true);
    try {
      await mutations.approve.mutateAsync(id);
      toast.success("承認しました！");
    } catch {
      toast.error("承認に失敗しました");
    } finally {
      setIsDoing(false);
    }
  };

  const handleDisapprove = async (id: string) => {
    setIsDoing(true);
    try {
      await mutations.disapprove.mutateAsync(id);
      toast.success("却下しました");
    } catch {
      toast.error("却下に失敗しました");
    } finally {
      setIsDoing(false);
    }
  };

  const handleRestore = async (id: string) => {
    setIsDoing(true);
    try {
      await mutations.restore.mutateAsync(id);
      toast.success("申請一覧に戻しました");
    } catch {
      toast.error("操作に失敗しました");
    } finally {
      setIsDoing(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDoing(true);
    try {
      await mutations.remove.mutateAsync(id);
      toast.success("削除しました");
    } catch {
      toast.error("削除に失敗しました");
    } finally {
      setIsDoing(false);
    }
  };

  const handleApproveOneTimeTask = async (id: string, newPoint: string) => {
    setIsDoing(true);
    try {
      await mutations.approveOneTimeTask.mutateAsync({ id, newPoint });
      toast.success("承認しました！");
    } catch {
      toast.error("承認に失敗しました");
    } finally {
      setIsDoing(false);
    }
  };

  const handleApproveTaskRequest = async (submission: Submission) => {
    setIsDoing(true);
    try {
      await mutations.approveTaskRequest.mutateAsync(submission);
      toast.success("承認してタスクに追加しました！");
    } catch {
      toast.error("承認に失敗しました");
    } finally {
      setIsDoing(false);
    }
  };

  return {
    isDoing,
    data: { pending, rejected, pendingTaskRequests, rejectedTaskRequests },
    editPoint: { get: getEditedPoint, set: setEditedPoint },
    actions: {
      approve: handleApprove,
      approveOneTimeTask: handleApproveOneTimeTask,
      disapprove: handleDisapprove,
      restore: handleRestore,
      delete: handleDelete,
      approveTaskRequest: handleApproveTaskRequest,
    },
  };
}
