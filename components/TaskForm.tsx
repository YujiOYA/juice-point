import React, { useState } from "react";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface TaskFormProps {
    user: string;
    points: PageObjectResponse[];
}

export default function TaskForm({ user, points }: TaskFormProps) {
    const [point, setPoint] = useState("");
    const [pObj, setPObj] = useState<PageObjectResponse | null>(null);
    const [isSubmitButtonDisable, setIsSubmitButtonDisable] = useState(false)

    function handleOnChangeSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const selectedPoint = points.find((p) => p.id === e.target.value);
        setPObj(selectedPoint || null);
        setPoint(selectedPoint?.properties.point.rich_text?.[0]?.plain_text ?? "");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSubmitButtonDisable(true)

        if (!pObj || !pObj.properties) {
            alert("タスクを選択してください");
            return;
        }

        const postData = {
            type: "register",
            whatYouDid: pObj.properties.task.rich_text?.[0]?.plain_text || "未定義",
            point: point,
            whoDid: user,
            status: "未承認"
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
            setIsSubmitButtonDisable(false)
            location.reload();
        }
    }

    return (
        <form id="point-form" onSubmit={handleSubmit}>
            <label htmlFor="task">🎯 タスクを選んでね</label>
            <select id="task" name="task" onChange={handleOnChangeSelect} className="input">
                <option disabled selected>タスクを選んでね！</option>
                {points.map((r: PageObjectResponse) => (
                    <option key={r.id} value={r.id}>
                        {r.properties.task.rich_text?.[0]?.plain_text || "未定義"}
                    </option>
                ))}
            </select>

            <label htmlFor="points">💰 もらえるポイント</label>
            <input type="number" id="points" name="points" value={point} readOnly className="input highlight" />

            <button id="register" className="submit-button" disabled={isSubmitButtonDisable}>✅ 申請する</button>
        </form>
    );
}
