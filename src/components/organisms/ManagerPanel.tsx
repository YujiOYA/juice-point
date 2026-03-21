"use client";

import Button from "@atom/Button";
import SubmissionCard from "@molecule/SubmissionCard";
import { useManagerPanel } from "@hook/useManagerPanel";
import { Submission } from "@type/submission";

interface Props {
  submissions: Submission[];
}

export default function ManagerPanel({ submissions }: Props) {
  const { isDoing, pending, handleApprove, handleDisapprove } = useManagerPanel(submissions);

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
                <th>申請日時</th>
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
                  <td>{new Date(s.createdAt).toLocaleString("ja-JP")}</td>
                  <td>
                    <Button variant="approve" disabled={isDoing} onClick={() => handleApprove(s.id)}>
                      承認
                    </Button>
                  </td>
                  <td>
                    <Button variant="disapprove" disabled={isDoing} onClick={() => handleDisapprove(s.id)}>
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
