import React, { useState } from "react";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { GetServerSideProps } from "next";
import { useNotionAPI } from "@/useNotionAPI";

interface Props {
  totals: PageObjectResponse[];
}

export default function Manager({ totals }: Props) {
  const [updatedTotals, setUpdatedTotals] = useState(totals);


  const handleDisapprove = async (id: string) => {
    const updated = updatedTotals.filter(total => total.id !== id)
    setUpdatedTotals(updated);
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
      location.reload();
    }
  }

  // 承認ボタンが押されたときにステータスを変更する関数
  const handleApprove = async (id: string) => {
    try {
      const updated = updatedTotals.map((total) =>
        total.id === id
          ? {
            ...total,
            properties: {
              ...total.properties,
              status: {
                ...total.properties.status,
                rich_text: [
                  {
                    type: "text",
                    text: { content: "承認" },
                    annotations: {
                      bold: false,
                      italic: false,
                      strikethrough: false,
                      underline: false,
                      code: false,
                    },
                    plain_text: "承認",
                  },
                ],
              },
            },
          }
          : total
      );
      setUpdatedTotals(updated);

      // APIでNotionのデータを更新
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
      location.reload();
    }
  };
  console.log(updatedTotals[0].properties.status);


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
          {updatedTotals.map((total) => (
            <tr key={total.id}>
              <td>{total.properties.whatYouDid?.rich_text?.[0]?.plain_text || "未定義"}</td>
              <td>{total.properties.whoDid?.rich_text?.[0]?.plain_text || "未定義"}</td>
              <td>{total.properties.point?.rich_text?.[0]?.plain_text || "0"}</td>
              <td>{total.properties.status.rich_text?.[0]?.plain_text || "未承認"}</td>
              <td>
                {total.properties.status?.rich_text?.[0]?.plain_text === "未承認" && (
                  <button
                    onClick={() => handleApprove(total.id)}
                    className="approve-button"
                  >
                    承認
                  </button>
                )}
              </td>
              <td>
                {total.properties.status?.rich_text?.[0]?.plain_text === "未承認" && (
                  <button
                    onClick={() => handleDisapprove(total.id)}
                    className="disapprove-button"
                  >
                    却下
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
