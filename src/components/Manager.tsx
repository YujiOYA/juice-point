import React, { useState } from "react";

import { Submission } from "../types/api/submission";

interface Props {
  submissions: Submission[];
}

export default function Manager({ submissions }: Props) {
  const [isDoing, setIsDoing] = useState(false);

  const pendingSubmissions = submissions.filter((s) => s.status === "未承認");

  const handleApprove = async (id: string) => {
    setIsDoing(true);
    try {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "approve", id }),
      });
      alert("ステータスが承認に変更されました！");
    } catch {
      alert("承認に失敗しました");
    } finally {
      setIsDoing(false);
      location.reload();
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
      alert("却下しました！");
    } catch {
      alert("却下に失敗しました");
    } finally {
      setIsDoing(false);
      location.reload();
    }
  };

  return (
    <div>
      <p className="manager-title">📋 申請一覧</p>

      {pendingSubmissions.length === 0 ? (
        <p className="no-submissions">申請はありません 🎉</p>
      ) : (
        <>
          {/* スマホ: カード形式 */}
          <div className="submission-list">
            {pendingSubmissions.map((s) => (
              <div key={s.id} className="submission-card">
                <p className="submission-card__task">{s.whatYouDid}</p>
                <div className="submission-card__meta">
                  <span>👤 {s.whoDid}</span>
                  <span>💰 {s.point}pt</span>
                </div>
                <div className="submission-card__actions">
                  <button
                    disabled={isDoing}
                    onClick={() => handleApprove(s.id)}
                    className="approve-button"
                  >
                    ✅ 承認
                  </button>
                  <button
                    disabled={isDoing}
                    onClick={() => handleDisapprove(s.id)}
                    className="disapprove-button"
                  >
                    ❌ 却下
                  </button>
                </div>
              </div>
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
              {pendingSubmissions.map((s) => (
                <tr key={s.id}>
                  <td>{s.whatYouDid}</td>
                  <td>{s.whoDid}</td>
                  <td>{s.point}</td>
                  <td>{s.status}</td>
                  <td>
                    <button
                      disabled={isDoing}
                      onClick={() => handleApprove(s.id)}
                      className="approve-button"
                    >
                      承認
                    </button>
                  </td>
                  <td>
                    <button
                      disabled={isDoing}
                      onClick={() => handleDisapprove(s.id)}
                      className="disapprove-button"
                    >
                      却下
                    </button>
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
