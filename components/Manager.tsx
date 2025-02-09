import React, { ReactNode, useState } from "react";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  totals: any[];
  children: ReactNode
}

export default function Manager({ totals }: Props) {
  const [isDoing, setIsDoing] = useState(false)

  const handleDisapprove = async (id: string) => {
    setIsDoing(true)
    // APIでNotionのデータを更新
    try {
      await fetch("/api/post-notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "disapprove", id: id }),
      });

      alert("却下しました！");
    } catch (error) {
      console.error("却下エラー:", error);
      alert("却下に失敗しました");
    }
    finally {
      setIsDoing(false)
      location.reload();
    }
  }

  // 承認ボタンが押されたときにステータスを変更する関数
  const handleApprove = async (id: string) => {
    setIsDoing(true)
    // APIでNotionのデータを更新
    try {
      await fetch("/api/post-notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "approve", id: id, status: "承認" }),
      });

      alert("ステータスが承認に変更されました！");
    } catch (error) {
      console.error("ステータス更新エラー:", error);
      alert("ステータスの変更に失敗しました");
    }
    finally {
      setIsDoing(false)
      location.reload();
    }
  };

  return (
    <div className="container">
      <h1>⭐ ポイント管理アプリ (管理者画面) ⭐</h1>
      <table>
        <thead>
          <tr>
            <th>タスク</th>
            <th>実施者</th>
            <th>ポイント</th>
            <th>ステータス</th>
            <th>操作</th>
            <th>却下</th>
          </tr>
        </thead>
        <tbody>
          {totals.map((total) => (
            <tr key={total.id}>
              <td>{total.properties.whatYouDid?.rich_text?.[0]?.plain_text || "未定義"}</td>
              <td>{total.properties.whoDid?.rich_text?.[0]?.plain_text || "未定義"}</td>
              <td>{total.properties.point?.rich_text?.[0]?.plain_text || "0"}</td>
              <td>{total.properties.status.rich_text?.[0]?.plain_text || "未承認"}</td>
              <td>
                {total.properties.status?.rich_text?.[0]?.plain_text === "未承認" && (
                  <button
                    disabled={isDoing}
                    onClick={() => handleApprove(total.id)}
                    className="approve-button"
                  >
                    <span>承認</span>
                  </button>
                )}
              </td>
              <td>
                {total.properties.status?.rich_text?.[0]?.plain_text === "未承認" && (
                  <button
                    disabled={isDoing}
                    onClick={() => handleDisapprove(total.id)}
                    className="disapprove-button"
                  >
                    <span>却下</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
