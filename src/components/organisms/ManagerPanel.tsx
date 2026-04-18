"use client";

import Button from "@atom/Button";
import SubmissionCard from "@molecule/SubmissionCard";
import UserPointsSummary from "@molecule/UserPointsSummary";
import { useManagerPanel } from "@hook/useManagerPanel";
import { Submission, SubmissionType } from "@type/submission";
import { User } from "@type/user";

interface Props {
  submissions: Submission[];
  users: User[];
}

export default function ManagerPanel({ submissions, users }: Props) {
  const { isDoing, data, editPoint, actions } = useManagerPanel(submissions);
  const { pending, rejected, pendingTaskRequests, rejectedTaskRequests } = data;
  const userName = (id: string) => users.find((u) => u.id === id)?.user ?? id;

  return (
    <div>
      <p className="manager-title">📋 申請一覧</p>

      {pending.length === 0 ? (
        <p className="no-submissions">申請はありません 🎉</p>
      ) : (
        <>
          {/* スマホ: カード形式 */}
          <div className="submission-list">
            {pending.map((s) => {
              const isOneTime = s.submissionType === SubmissionType.OneTimeTask;
              return (
                <SubmissionCard
                  key={s.id}
                  submission={s}
                  whoseName={userName(s.whoDid)}
                  isDoing={isDoing}
                  editablePoint={isOneTime ? editPoint.get(s.id, s.point) : undefined}
                  onPointChange={isOneTime ? (point) => editPoint.set(s.id, point) : undefined}
                  onApprove={isOneTime ? () => actions.approveOneTimeTask(s.id, editPoint.get(s.id, s.point)) : actions.approve}
                  onDisapprove={actions.disapprove}
                />
              );
            })}
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
              {pending.map((s) => {
                const isOneTime = s.submissionType === SubmissionType.OneTimeTask;
                return (
                  <tr key={s.id}>
                    <td>
                      {isOneTime && (
                        <>
                          <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 600, color: "#fff", background: "#f59e0b", borderRadius: "4px", padding: "0.1rem 0.4rem" }}>
                            未登録タスク
                          </span>
                          <br />
                        </>
                      )}
                      {s.whatYouDid}
                    </td>
                    <td>{userName(s.whoDid)}</td>
                    <td>
                      {isOneTime ? (
                        <input
                          type="number"
                          value={editPoint.get(s.id, s.point)}
                          onChange={(e) => editPoint.set(s.id, e.target.value)}
                          style={{ width: "4rem", padding: "0.1rem 0.3rem", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "0.9rem" }}
                        />
                      ) : (
                        s.point
                      )}
                    </td>
                    <td>{s.status}</td>
                    <td>{new Date(s.createdAt).toLocaleString("ja-JP")}</td>
                    <td>
                      <Button
                        variant="approve"
                        disabled={isDoing}
                        onClick={() => isOneTime ? actions.approveOneTimeTask(s.id, editPoint.get(s.id, s.point)) : actions.approve(s.id)}
                      >
                        承認
                      </Button>
                    </td>
                    <td>
                      <Button variant="disapprove" disabled={isDoing} onClick={() => actions.disapprove(s.id)}>
                        却下
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {rejected.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <p className="manager-title">❌ 却下済み</p>

          {/* スマホ: カード形式 */}
          <div className="submission-list">
            {rejected.map((s) => (
              <SubmissionCard
                key={s.id}
                submission={s}
                whoseName={userName(s.whoDid)}
                isDoing={isDoing}
                onRestore={actions.restore}
                onDelete={actions.delete}
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
                <th>戻す</th>
                <th>削除</th>
              </tr>
            </thead>
            <tbody>
              {rejected.map((s) => {
                const isOneTime = s.submissionType === SubmissionType.OneTimeTask;
                return (
                  <tr key={s.id}>
                    <td>
                      {isOneTime && (
                        <>
                          <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 600, color: "#fff", background: "#f59e0b", borderRadius: "4px", padding: "0.1rem 0.4rem" }}>
                            未登録タスク
                          </span>
                          <br />
                        </>
                      )}
                      {s.whatYouDid}
                    </td>
                    <td>{userName(s.whoDid)}</td>
                    <td>{s.point}</td>
                    <td>{s.status}</td>
                    <td>{new Date(s.createdAt).toLocaleString("ja-JP")}</td>
                    <td>
                      <Button variant="approve" disabled={isDoing} onClick={() => actions.restore(s.id)}>
                        🔄 戻す
                      </Button>
                    </td>
                    <td>
                      <Button variant="disapprove" disabled={isDoing} onClick={() => actions.delete(s.id)}>
                        🗑️ 削除
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="manager-title" style={{ marginTop: "2rem" }}>💰 未使用ポイント</p>
      <UserPointsSummary users={users.filter((u) => u.authority !== "admin")} submissions={submissions} />

      <p className="manager-title" style={{ marginTop: "2rem" }}>📝 タスク追加リクエスト</p>

      {pendingTaskRequests.length === 0 ? (
        <p className="no-submissions">リクエストはありません 🎉</p>
      ) : (
        <>
          <div className="submission-list">
            {pendingTaskRequests.map((s) => (
              <SubmissionCard
                key={s.id}
                submission={s}
                whoseName={userName(s.whoDid)}
                isDoing={isDoing}
                onApprove={() => actions.approveTaskRequest(s)}
                onDisapprove={actions.disapprove}
              />
            ))}
          </div>

          <table className="manager-table">
            <thead>
              <tr>
                <th>タスク名</th>
                <th>リクエスト者</th>
                <th>希望ポイント</th>
                <th>ステータス</th>
                <th>申請日時</th>
                <th>承認</th>
                <th>却下</th>
              </tr>
            </thead>
            <tbody>
              {pendingTaskRequests.map((s) => (
                <tr key={s.id}>
                  <td>{s.whatYouDid}</td>
                  <td>{userName(s.whoDid)}</td>
                  <td>{s.point}</td>
                  <td>{s.status}</td>
                  <td>{new Date(s.createdAt).toLocaleString("ja-JP")}</td>
                  <td>
                    <Button variant="approve" disabled={isDoing} onClick={() => actions.approveTaskRequest(s)}>
                      承認
                    </Button>
                  </td>
                  <td>
                    <Button variant="disapprove" disabled={isDoing} onClick={() => actions.disapprove(s.id)}>
                      却下
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {rejectedTaskRequests.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <p className="manager-title">❌ 却下済みタスク追加リクエスト</p>
          <div className="submission-list">
            {rejectedTaskRequests.map((s) => (
              <SubmissionCard
                key={s.id}
                submission={s}
                whoseName={userName(s.whoDid)}
                isDoing={isDoing}
                onRestore={actions.restore}
                onDelete={actions.delete}
              />
            ))}
          </div>
          <table className="manager-table">
            <thead>
              <tr>
                <th>タスク名</th>
                <th>リクエスト者</th>
                <th>希望ポイント</th>
                <th>ステータス</th>
                <th>申請日時</th>
                <th>戻す</th>
                <th>削除</th>
              </tr>
            </thead>
            <tbody>
              {rejectedTaskRequests.map((s) => (
                <tr key={s.id}>
                  <td>{s.whatYouDid}</td>
                  <td>{userName(s.whoDid)}</td>
                  <td>{s.point}</td>
                  <td>{s.status}</td>
                  <td>{new Date(s.createdAt).toLocaleString("ja-JP")}</td>
                  <td>
                    <Button variant="approve" disabled={isDoing} onClick={() => actions.restore(s.id)}>
                      🔄 戻す
                    </Button>
                  </td>
                  <td>
                    <Button variant="disapprove" disabled={isDoing} onClick={() => actions.delete(s.id)}>
                      🗑️ 削除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
