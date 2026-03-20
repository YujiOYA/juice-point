"use client";
import Link from "next/link";

import Button from "@/components/atoms/Button";
import SelectInput from "@/components/atoms/SelectInput";
import TextInput from "@/components/atoms/TextInput";
import TaskCard from "@/components/molecules/TaskCard";
import { useTaskManager } from "@/hooks/useTaskManager";
import { Task } from "@/types/task";
import { User } from "@/types/user";

interface Props {
  users: User[];
  initialTasks: Task[];
}

export default function TaskManagerClient({ users, initialTasks }: Props) {
  const {
    tasks,
    form,
    setForm,
    editingId,
    setEditingId,
    editForm,
    setEditForm,
    isLoading,
    handleCreate,
    startEdit,
    handleUpdate,
    handleDelete,
  } = useTaskManager(initialTasks);

  return (
    <div className="task-admin-wrap">
      <Link href="/">
        <Button variant="logout" style={{ marginBottom: "1rem" }}>← 戻る</Button>
      </Link>
      <h1 style={{ marginBottom: "1.5rem" }}>🛠 タスク管理</h1>

      {/* 追加フォーム */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>タスクを追加</h2>
        <form onSubmit={handleCreate} className="task-add-form">
          <TextInput
            placeholder="タスク名"
            value={form.task}
            onChange={(e) => setForm({ ...form, task: e.target.value })}
          />
          <TextInput
            placeholder="ポイント"
            type="number"
            value={form.point}
            onChange={(e) => setForm({ ...form, point: e.target.value })}
            style={{ maxWidth: "120px" }}
          />
          <SelectInput value={form.whose} onChange={(e) => setForm({ ...form, whose: e.target.value })}>
            <option value="" disabled>担当者を選択</option>
            {users.map((u) => (
              <option key={u.id} value={u.user}>{u.user}</option>
            ))}
          </SelectInput>
          <Button type="submit" variant="primary" disabled={isLoading}>
            追加
          </Button>
        </form>
      </section>

      {/* タスク一覧 */}
      <section>
        <h2 style={{ marginBottom: "1rem" }}>タスク一覧</h2>

        {/* スマホ: カード */}
        <div className="task-list">
          {tasks.map((t) =>
            editingId === t.id ? (
              <TaskCard
                key={t.id}
                isEditing={true}
                task={t}
                editForm={editForm}
                users={users}
                isLoading={isLoading}
                onChangeForm={setEditForm}
                onSave={handleUpdate}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <TaskCard
                key={t.id}
                isEditing={false}
                task={t}
                isLoading={isLoading}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            )
          )}
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
                      <TextInput
                        value={editForm.task}
                        onChange={(e) => setEditForm({ ...editForm, task: e.target.value })}
                      />
                    </td>
                    <td>
                      <TextInput
                        type="number"
                        value={editForm.point}
                        onChange={(e) => setEditForm({ ...editForm, point: e.target.value })}
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>
                      <SelectInput value={editForm.whose} onChange={(e) => setEditForm({ ...editForm, whose: e.target.value })}>
                        {users.map((u) => (
                          <option key={u.id} value={u.user}>{u.user}</option>
                        ))}
                      </SelectInput>
                    </td>
                    <td style={{ display: "flex", gap: "0.5rem" }}>
                      <Button variant="approve" disabled={isLoading} onClick={() => handleUpdate(t.id)}>
                        保存
                      </Button>
                      <Button variant="logout" onClick={() => setEditingId(null)}>
                        キャンセル
                      </Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{t.task}</td>
                    <td>{t.point}pt</td>
                    <td>{t.whose}</td>
                    <td style={{ display: "flex", gap: "0.5rem" }}>
                      <Button variant="primary" disabled={isLoading} onClick={() => startEdit(t)}>
                        編集
                      </Button>
                      <Button variant="disapprove" disabled={isLoading} onClick={() => handleDelete(t.id)}>
                        削除
                      </Button>
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
