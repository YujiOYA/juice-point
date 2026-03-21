"use client";

import AdminTable from "@molecule/AdminTable";
import Button from "@atom/Button";
import Card from "@atom/Card";
import SelectInput from "@atom/SelectInput";
import TextInput from "@atom/TextInput";
import UserCard from "@molecule/UserCard";
import { useUserManager } from "@hook/useUserManager";
import { User } from "@type/user";

interface Props {
  initialUsers: User[];
}

const authorityLabel = (a: string) => (a === "admin" ? "管理者" : "一般");

export default function UserManagerClient({ initialUsers }: Props) {
  const {
    users,
    sortKey,
    sortDir,
    handleSort,
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
  } = useUserManager(initialUsers);

  type SortKey = "user" | "authority";
  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "user", label: "ユーザー名" },
    { value: "authority", label: "権限" },
  ];

  return (
    <div>
      {/* 追加フォーム */}
      <Card variant="add" className="task-add-card">
        <h2 style={{ marginBottom: "1rem" }}>ユーザーを追加</h2>
        <form onSubmit={handleCreate} className="task-add-form">
          <TextInput
            placeholder="ユーザー名"
            value={form.user}
            onChange={(e) => setForm({ ...form, user: e.target.value })}
          />
          <TextInput
            type="password"
            placeholder="PIN"
            value={form.pin}
            onChange={(e) => setForm({ ...form, pin: e.target.value })}
            style={{ maxWidth: "150px" }}
          />
          <SelectInput
            value={form.authority}
            onChange={(e) => setForm({ ...form, authority: e.target.value })}
          >
            <option value="user">一般</option>
            <option value="admin">管理者</option>
          </SelectInput>
          <Button type="submit" variant="primary" disabled={isLoading}>
            追加
          </Button>
        </form>
      </Card>

      {/* ユーザー一覧 */}
      <section>
        <h2 style={{ marginBottom: "1rem" }}>ユーザー一覧</h2>

        {/* スマホ: ソート */}
        <div className="task-sort-bar">
          <span className="task-sort-label">並び替え</span>
          <SelectInput value={sortKey} onChange={(e) => handleSort(e.target.value as SortKey)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </SelectInput>
          <Button variant="logout" onClick={() => handleSort(sortKey)}>
            {sortDir === "asc" ? "↑" : "↓"}
          </Button>
        </div>

        {/* スマホ: カード */}
        <div className="task-list">
          {users.map((u) =>
            editingId === u.id ? (
              <UserCard
                key={u.id}
                isEditing={true}
                user={u}
                editForm={editForm}
                isLoading={isLoading}
                onChangeForm={setEditForm}
                onSave={handleUpdate}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <UserCard
                key={u.id}
                isEditing={false}
                user={u}
                isLoading={isLoading}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            )
          )}
        </div>

        {/* PC: テーブル */}
        <AdminTable
          columns={[
            { key: "user",      label: "ユーザー名", sortable: true },
            { key: "authority", label: "権限",       sortable: true },
            { key: "actions",   label: "" },
          ]}
          sortKey={sortKey}
          sortDir={sortDir}
          sortKey2={null}
          sortDir2="asc"
          onSort={(k) => handleSort(k as SortKey)}
          onSort2={() => {}}
        >
          {users.map((u) => (
            <tr key={u.id}>
              {editingId === u.id ? (
                <>
                  <td>
                    <TextInput
                      value={editForm.user}
                      onChange={(e) => setEditForm({ ...editForm, user: e.target.value })}
                    />
                  </td>
                  <td>
                    <SelectInput
                      value={editForm.authority}
                      onChange={(e) => setEditForm({ ...editForm, authority: e.target.value })}
                    >
                      <option value="user">一般</option>
                      <option value="admin">管理者</option>
                    </SelectInput>
                  </td>
                  <td className="task-table__actions">
                    <TextInput
                      type="password"
                      placeholder="PIN（空欄で変更なし）"
                      value={editForm.pin}
                      onChange={(e) => setEditForm({ ...editForm, pin: e.target.value })}
                      style={{ width: "160px" }}
                    />
                    <Button variant="approve" disabled={isLoading} onClick={() => handleUpdate(u.id)}>保存</Button>
                    <Button variant="logout" onClick={() => setEditingId(null)}>キャンセル</Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{u.user}</td>
                  <td>{authorityLabel(u.authority)}</td>
                  <td className="task-table__actions">
                    <Button variant="primary" disabled={isLoading} onClick={() => startEdit(u)}>編集</Button>
                    <Button variant="disapprove" disabled={isLoading} onClick={() => handleDelete(u.id)}>削除</Button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </AdminTable>
      </section>
    </div>
  );
}
