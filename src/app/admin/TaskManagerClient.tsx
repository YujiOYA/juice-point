"use client";
import Link from "next/link";
import { useState } from "react";

import { Task } from "@/types/task";
import { User } from "@/types/user";

interface Props {
  users: User[];
  initialTasks: Task[];
}

const emptyForm = { task: "", point: "", whose: "" };

export default function TaskManagerClient({ users, initialTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);

  const refreshTasks = async () => {
    const res = await fetch("/api/tasks");
    setTasks(await res.json());
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.task || !form.point || !form.whose) return;
    setIsLoading(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "create", ...form }),
      });
      setForm(emptyForm);
      await refreshTasks();
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditForm({ task: task.task, point: task.point, whose: task.whose });
  };

  const handleUpdate = async (id: string) => {
    setIsLoading(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "update", id, ...editForm }),
      });
      setEditingId(null);
      await refreshTasks();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このタスクを削除しますか？")) return;
    setIsLoading(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "delete", id }),
      });
      await refreshTasks();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <Link href="/">
        <button className="logout-button" style={{ marginBottom: "1rem" }}>← 戻る</button>
      </Link>
      <h1 style={{ marginBottom: "2rem" }}>🛠 タスク管理</h1>

      {/* 追加フォーム */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>タスクを追加</h2>
        <form onSubmit={handleCreate} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            placeholder="タスク名"
            value={form.task}
            onChange={(e) => setForm({ ...form, task: e.target.value })}
            className="input"
          />
          <input
            placeholder="ポイント"
            type="number"
            value={form.point}
            onChange={(e) => setForm({ ...form, point: e.target.value })}
            className="input"
            style={{ width: "100px" }}
          />
          <select
            value={form.whose}
            onChange={(e) => setForm({ ...form, whose: e.target.value })}
            className="input"
          >
            <option value="" disabled>担当者を選択</option>
            {users.map((u) => (
              <option key={u.id} value={u.user}>{u.user}</option>
            ))}
          </select>
          <button type="submit" disabled={isLoading} className="submit-button">
            追加
          </button>
        </form>
      </section>

      {/* タスク一覧 */}
      <section>
        <h2 style={{ marginBottom: "1rem" }}>タスク一覧</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>タスク名</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>ポイント</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>担当者</th>
              <th style={{ padding: "0.5rem" }}></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                {editingId === t.id ? (
                  <>
                    <td style={{ padding: "0.5rem" }}>
                      <input
                        value={editForm.task}
                        onChange={(e) => setEditForm({ ...editForm, task: e.target.value })}
                        className="input"
                      />
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      <input
                        type="number"
                        value={editForm.point}
                        onChange={(e) => setEditForm({ ...editForm, point: e.target.value })}
                        className="input"
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      <select
                        value={editForm.whose}
                        onChange={(e) => setEditForm({ ...editForm, whose: e.target.value })}
                        className="input"
                      >
                        {users.map((u) => (
                          <option key={u.id} value={u.user}>{u.user}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: "0.5rem", display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => handleUpdate(t.id)} disabled={isLoading} className="approve-button">
                        保存
                      </button>
                      <button onClick={() => setEditingId(null)} className="logout-button">
                        キャンセル
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: "0.5rem" }}>{t.task}</td>
                    <td style={{ padding: "0.5rem" }}>{t.point}</td>
                    <td style={{ padding: "0.5rem" }}>{t.whose}</td>
                    <td style={{ padding: "0.5rem", display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => startEdit(t)} disabled={isLoading} className="submit-button">
                        編集
                      </button>
                      <button onClick={() => handleDelete(t.id)} disabled={isLoading} className="disapprove-button">
                        削除
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
