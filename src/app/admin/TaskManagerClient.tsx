"use client";

import Button from "@atom/Button";
import Card from "@atom/Card";
import SelectInput from "@atom/SelectInput";
import TextInput from "@atom/TextInput";
import TaskCard from "@molecule/TaskCard";
import { useTaskManager } from "@hook/useTaskManager";
import { Task } from "@type/task";
import { User } from "@type/user";

interface Props {
  users: User[];
  initialTasks: Task[];
}

export default function TaskManagerClient({ users, initialTasks }: Props) {
  const {
    tasks,
    sortKey,
    sortDir,
    handleSort,
    sortKey2,
    sortDir2,
    handleSort2,
    filterWhose,
    setFilterWhose,
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

  type SortKey = "task" | "point";
  const sortIcon = (key: SortKey) => {
    if (sortKey === key) return ` ¹${sortDir === "asc" ? "↑" : "↓"}`;
    if (sortKey2 === key) return ` ²${sortDir2 === "asc" ? "↑" : "↓"}`;
    return " ↕";
  };

  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "task", label: "タスク名" },
    { value: "point", label: "ポイント" },
  ];

  return (
    <div>
      {/* 追加フォーム */}
      <Card variant="add" className="task-add-card">
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
      </Card>

      {/* タスク一覧 */}
      <section>
        <h2 style={{ marginBottom: "1rem" }}>タスク一覧</h2>

        {/* フィルター */}
        <div className="task-filter-bar">
          <span className="task-sort-label">担当者</span>
          <SelectInput value={filterWhose} onChange={(e) => setFilterWhose(e.target.value)}>
            <option value="">全員</option>
            {users.map((u) => (
              <option key={u.id} value={u.user}>{u.user}</option>
            ))}
          </SelectInput>
        </div>

        {/* スマホ: ソート */}
        <div className="task-sort-bar">
          <span className="task-sort-label">第1</span>
          <SelectInput
            value={sortKey}
            onChange={(e) => handleSort(e.target.value as SortKey)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </SelectInput>
          <Button variant="logout" onClick={() => handleSort(sortKey)}>
            {sortDir === "asc" ? "↑" : "↓"}
          </Button>
        </div>
        <div className="task-sort-bar">
          <span className="task-sort-label">第2</span>
          <SelectInput
            value={sortKey2 ?? ""}
            onChange={(e) => handleSort2((e.target.value || null) as SortKey | null)}
          >
            <option value="">なし</option>
            {SORT_OPTIONS.filter((o) => o.value !== sortKey).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </SelectInput>
          {sortKey2 && (
            <Button variant="logout" onClick={() => handleSort2(sortKey2)}>
              {sortDir2 === "asc" ? "↑" : "↓"}
            </Button>
          )}
        </div>

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
              {SORT_OPTIONS.map((o) => (
                <th
                  key={o.value}
                  onClick={(e) => e.shiftKey ? handleSort2(o.value) : handleSort(o.value)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                  title="クリック: 第1優先 / Shift+クリック: 第2優先"
                >
                  {o.label}{sortIcon(o.value)}
                </th>
              ))}
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
