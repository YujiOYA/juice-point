import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Submission } from "@type/submission";

export function useManagerPanel(submissions: Submission[], onRefresh: () => Promise<void>) {
  const [isDoing, setIsDoing] = useState(false);
  const [pending, setPending] = useState(submissions.filter((s) => s.status === "未承認" && s.submissionType !== "taskRequest"));
  const [rejected, setRejected] = useState(submissions.filter((s) => s.status === "却下" && s.submissionType !== "taskRequest"));
  const [pendingTaskRequests, setPendingTaskRequests] = useState(submissions.filter((s) => s.status === "未承認" && s.submissionType === "taskRequest"));
  const [rejectedTaskRequests, setRejectedTaskRequests] = useState(submissions.filter((s) => s.status === "却下" && s.submissionType === "taskRequest"));

  useEffect(() => {
    setPending(submissions.filter((s) => s.status === "未承認" && s.submissionType !== "taskRequest"));
    setRejected(submissions.filter((s) => s.status === "却下" && s.submissionType !== "taskRequest"));
    setPendingTaskRequests(submissions.filter((s) => s.status === "未承認" && s.submissionType === "taskRequest"));
    setRejectedTaskRequests(submissions.filter((s) => s.status === "却下" && s.submissionType === "taskRequest"));
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

  return { isDoing, pending, rejected, pendingTaskRequests, rejectedTaskRequests, handleApprove, handleDisapprove, handleRestore, handleDelete, handleApproveTaskRequest };
}
