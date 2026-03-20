"use client";
import { useState } from "react";

import Button from "@/components/atoms/Button";
import SubmissionCard from "@/components/molecules/SubmissionCard";
import { Submission } from "@/types/submission";
import { getSubmissions } from "@/lib/dynamoDbApi";

interface Props {
  submissions: Submission[];
}

export default function ManagerPanel({ submissions }: Props) {
  const [isDoing, setIsDoing] = useState(false);

  const [pending,setPending] =useState(submissions.filter((s) => s.status === "未承認"));

  const handleApprove = async (id: string) => {
    setIsDoing(true);
    try {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "approve", id }),
      });
      const submissions = await getSubmissions()
      setPending(submissions.filter((s) => s.status === "未承認"))
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
      const submissions = await getSubmissions()
      setPending(submissions.filter((s) => s.status === "未承認"))
      alert("却下しました！");
    } catch {
      alert("却下に失敗しました");
    } finally {
      setIsDoing(false);
    }
  };

  return (
    <div>
      <p className="manager-title">📋 申請一覧</p>

      {pending.length === 0 ? (
        <p className="no-submissions">申請はありません 🎉</p>
      ) : (
        <>
          {/* スマホ: カード形式 */}
          <div className="submission-list">
            {pending.map((s) => (
              <SubmissionCard
                key={s.id}
                submission={s}
                isDoing={isDoing}
                onApprove={handleApprove}
                onDisapprove={handleDisapprove}
              />
            ))}
          </div>

          {/* PC: テーブル形式 */}
          <table className="manager-table">
            <thead>
              <tr>
                <th>タスク</th>
                <th>実施者</th>
                <th>ポイント</th>
                <th>ステータス</th>
                <th>承認</th>
                <th>却下</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((s) => (
                <tr key={s.id}>
                  <td>{s.whatYouDid}</td>
                  <td>{s.whoDid}</td>
                  <td>{s.point}</td>
                  <td>{s.status}</td>
                  <td>
                    <Button
                      variant="approve"
                      disabled={isDoing}
                      onClick={() => handleApprove(s.id)}
                    >
                      承認
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="disapprove"
                      disabled={isDoing}
                      onClick={() => handleDisapprove(s.id)}
                    >
                      却下
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
