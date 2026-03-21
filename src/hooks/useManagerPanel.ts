import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Submission } from "@type/submission";

export function useManagerPanel(submissions: Submission[], onRefresh: () => Promise<void>) {
  const [isDoing, setIsDoing] = useState(false);
  const [pending, setPending] = useState(submissions.filter((s) => s.status === "未承認"));
  const [rejected, setRejected] = useState(submissions.filter((s) => s.status === "却下"));

  useEffect(() => {
    setPending(submissions.filter((s) => s.status === "未承認"));
    setRejected(submissions.filter((s) => s.status === "却下"));
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

  return { isDoing, pending, rejected, handleApprove, handleDisapprove, handleDelete };
}
