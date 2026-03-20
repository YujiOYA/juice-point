import { useEffect, useState } from "react";

import { Submission } from "@/types/submission";

export function useManagerPanel(submissions: Submission[], onRefresh: () => Promise<void>) {
  const [isDoing, setIsDoing] = useState(false);
  const [pending, setPending] = useState(submissions.filter((s) => s.status === "未承認"));

  useEffect(() => {
    setPending(submissions.filter((s) => s.status === "未承認"));
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
      alert("ステータスが承認に変更されました！");
    } catch {
      alert("承認に失敗しました");
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
      alert("却下しました！");
    } catch {
      alert("却下に失敗しました");
    } finally {
      setIsDoing(false);
    }
  };

  return { isDoing, pending, handleApprove, handleDisapprove };
}
