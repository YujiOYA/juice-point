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
    <div className="task-admin-wrap">
      <Link href="/">
        <button className="logout-button" style={{ marginBottom: "1rem" }}>← 戻る</button>
      </Link>
      <h1 style={{ marginBottom: "1.5rem" }}>🛠 タスク管理</h1>

      {/* 追加フォーム */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>タスクを追加</h2>
        <form onSubmit={handleCreate} className="task-add-form">
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
            style={{ maxWidth: "120px" }}
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

        {/* スマホ: カード */}
        <div className="task-list">
          {tasks.map((t) => (
            <div key={t.id} className="task-card">
              {editingId === t.id ? (
                <div className="task-card__edit-form">
                  <input
                    value={editForm.task}
                    onChange={(e) => setEditForm({ ...editForm, task: e.target.value })}
                    className="input"
                    placeholder="タスク名"
                  />
                  <input
                    type="number"
                    value={editForm.point}
                    onChange={(e) => setEditForm({ ...editForm, point: e.target.value })}
                    className="input"
                    placeholder="ポイント"
                  />
                  <select
                    value={editForm.whose}
                    onChange={(e) => setEditForm({ ...editForm, whose: e.target.value })}
                    className="input"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.user}>{u.user}</option>
                    ))}
                  </select>
                  <div className="task-card__actions">
                    <button onClick={() => handleUpdate(t.id)} disabled={isLoading} className="approve-button">
                      保存
                    </button>
                    <button onClick={() => setEditingId(null)} className="logout-button">
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="task-card__name">{t.task}</p>
                  <div className="task-card__meta">
                    <span>💰 {t.point}pt</span>
                    <span>👤 {t.whose}</span>
                  </div>
                  <div className="task-card__actions">
                    <button onClick={() => startEdit(t)} disabled={isLoading} className="submit-button">
                      編集
                    </button>
                    <button onClick={() => handleDelete(t.id)} disabled={isLoading} className="disapprove-button">
                      削除
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* PC: テーブル */}
        <table className="task-table">
          <thead>
            <tr>
              <th>タスク名</th>
              <th>ポイント</th>
              <th>担当者</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                {editingId === t.id ? (
                  <>
                    <td>
                      <input
                        value={editForm.task}
                        onChange={(e) => setEditForm({ ...editForm, task: e.target.value })}
                        className="input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editForm.point}
                        onChange={(e) => setEditForm({ ...editForm, point: e.target.value })}
                        className="input"
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>
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
                    <td style={{ display: "flex", gap: "0.5rem" }}>
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
                    <td>{t.task}</td>
                    <td>{t.point}pt</td>
                    <td>{t.whose}</td>
                    <td style={{ display: "flex", gap: "0.5rem" }}>
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
