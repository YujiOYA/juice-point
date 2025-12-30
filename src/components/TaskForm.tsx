import React, { useState } from "react";

interface TaskFormProps {
    user: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    points: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users: any[];
}
export default function TaskForm({ user, points, users }: TaskFormProps) {
  const [point, setPoint] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pObj, setPObj] = useState<any | null>(null);
  const [isSubmitButtonDisable, setIsSubmitButtonDisable] = useState(false);

  function handleOnChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedPoint = points.find((p) => p.id === e.target.value);
    setPObj(selectedPoint || null);
    setPoint(selectedPoint?.properties.point.rich_text?.[0]?.plain_text ?? "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitButtonDisable(true);

    if (!pObj || !pObj.properties) {
      alert("タスクを選択してください");
      return;
    }

    const postData = {
      type: "register",
      whatYouDid: pObj.properties.task.rich_text?.[0]?.plain_text || "未定義",
      point: point,
      whoDid: user,
      status: "未承認",
    };

    try {
      const response = await fetch("/api/post-notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error("Failed to post to Notion");

      alert("申請しました！");
    } catch (error) {
      console.error("申請エラー:", error);
      alert("エラーが発生しました");
    }
    finally{
      setIsSubmitButtonDisable(false);
      location.reload();
    }
  }
    
  return (
    <form id="point-form" onSubmit={handleSubmit}>
      <label htmlFor="task">🎯 タスクを<ruby>選<rt>えら</rt></ruby>んでね</label>
      <select id="task" name="task" onChange={handleOnChangeSelect} className="input">
        <option disabled selected>タスクを選んでね！</option>
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          points.map((r: any) => (<>
            {users?.find(u => u.properties.name.rich_text?.[0]?.plain_text === user).properties.id.title[0].plain_text ===  r.properties.whose.rich_text?.[0]?.plain_text ?
                         
              <option key={r.id} value={r.id}>
                {r.properties.task.rich_text?.[0]?.plain_text || "未定義"}
              </option>
              :
              <></>
            }
          </>
          ))}
      </select>

      <label htmlFor="points">💰 もらえるポイント</label>
      <input type="number" id="points" name="points" value={point} readOnly className="input highlight" />

      <button id="register" className="submit-button" disabled={isSubmitButtonDisable}>✅ <ruby>申請<rt>しんせい</rt></ruby>する</button>
    </form>
  );
}
