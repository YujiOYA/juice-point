import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Submission, SubmissionType } from "@type/submission";

export function useManagerPanel(submissions: Submission[], onRefresh: () => Promise<void>) {
  const [isDoing, setIsDoing] = useState(false);
  const [editedPoints, setEditedPoints] = useState<Map<string, string>>(new Map());

  const getEditedPoint = (id: string, defaultPoint: string) => editedPoints.get(id) ?? defaultPoint;

  const setEditedPoint = (id: string, point: string) => {
    setEditedPoints((prev) => new Map(prev).set(id, point));
  };
  const [pending, setPending] = useState(submissions.filter((s) => s.status === "未承認" && s.submissionType !== SubmissionType.TaskRequest));
  const [rejected, setRejected] = useState(submissions.filter((s) => s.status === "却下" && s.submissionType !== SubmissionType.TaskRequest));
  const [pendingTaskRequests, setPendingTaskRequests] = useState(submissions.filter((s) => s.status === "未承認" && s.submissionType === SubmissionType.TaskRequest));
  const [rejectedTaskRequests, setRejectedTaskRequests] = useState(submissions.filter((s) => s.status === "却下" && s.submissionType === SubmissionType.TaskRequest));

  useEffect(() => {
    setPending(submissions.filter((s) => s.status === "未承認" && s.submissionType !== SubmissionType.TaskRequest));
    setRejected(submissions.filter((s) => s.status === "却下" && s.submissionType !== SubmissionType.TaskRequest));
    setPendingTaskRequests(submissions.filter((s) => s.status === "未承認" && s.submissionType === SubmissionType.TaskRequest));
    setRejectedTaskRequests(submissions.filter((s) => s.status === "却下" && s.submissionType === SubmissionType.TaskRequest));
  }, [submissions]);

  const handleApprove = async (id: string) => {
    setIsDoing(true);
    try {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "approve", id }),
      });
      await onRefresh();
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
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "disapprove", id }),
      });
      await onRefresh();
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
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "restore", id }),
      });
      await onRefresh();
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
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "delete", id }),
      });
      await onRefresh();
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
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "approveOneTimeTask", id, newPoint }),
      });
      await onRefresh();
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
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "approveTaskRequest",
          id: submission.id,
          taskName: submission.whatYouDid,
          point: submission.point,
          whoDid: submission.whoDid,
        }),
      });
      await onRefresh();
      toast.success("承認してタスクに追加しました！");
    } catch {
      toast.error("承認に失敗しました");
    } finally {
      setIsDoing(false);
    }
  };

  return { isDoing, pending, rejected, pendingTaskRequests, rejectedTaskRequests, editedPoints, getEditedPoint, setEditedPoint, handleApprove, handleApproveOneTimeTask, handleDisapprove, handleRestore, handleDelete, handleApproveTaskRequest };
}
