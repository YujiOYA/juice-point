"use client";

import AdminTable from "@molecule/AdminTable";
import Button from "@atom/Button";
import Card from "@atom/Card";
import SelectInput from "@atom/SelectInput";
import TextInput from "@atom/TextInput";
import RewardCard from "@molecule/RewardCard";
import { useRewardManager } from "@hook/useRewardManager";
import { Reward } from "@type/reward";
import { User } from "@type/user";

interface Props {
  users: User[];
  initialRewards: Reward[];
}

export default function RewardManagerClient({ users, initialRewards }: Props) {
  const userName = (id: string) => users.find((u) => u.id === id)?.user ?? id;

  const {
    rewards,
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
  } = useRewardManager(initialRewards);

  type SortKey = "name" | "point";
  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "name", label: "報酬名" },
    { value: "point", label: "ポイント" },
  ];

  return (
    <div>
      {/* 追加フォーム */}
      <Card variant="add" className="task-add-card">
        <h2 style={{ marginBottom: "1rem" }}>報酬を追加</h2>
        <form onSubmit={handleCreate} className="task-add-form">
          <TextInput
            placeholder="報酬名（例: ジュース）"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextInput
            placeholder="必要ポイント"
            type="number"
            value={form.point}
            onChange={(e) => setForm({ ...form, point: e.target.value })}
            style={{ maxWidth: "150px" }}
          />
          <SelectInput value={form.whose} onChange={(e) => setForm({ ...form, whose: e.target.value })}>
            <option value="" disabled>担当者を選択</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.user}</option>
            ))}
          </SelectInput>
          <Button type="submit" variant="primary" disabled={isLoading}>
            追加
          </Button>
        </form>
      </Card>

      {/* 報酬一覧 */}
      <section>
        <h2 style={{ marginBottom: "1rem" }}>報酬一覧</h2>

        {/* フィルター */}
        <div className="task-filter-bar">
          <span className="task-sort-label">担当者</span>
          <SelectInput value={filterWhose} onChange={(e) => setFilterWhose(e.target.value)}>
            <option value="">全員</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.user}</option>
            ))}
          </SelectInput>
        </div>

        {/* スマホ: ソート */}
        <div className="task-sort-bar">
          <span className="task-sort-label">第1</span>
          <SelectInput value={sortKey} onChange={(e) => handleSort(e.target.value as SortKey)}>
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
          {rewards.map((r) =>
            editingId === r.id ? (
              <RewardCard
                key={r.id}
                isEditing={true}
                reward={r}
                editForm={editForm}
                users={users}
                isLoading={isLoading}
                onChangeForm={setEditForm}
                onSave={handleUpdate}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <RewardCard
                key={r.id}
                isEditing={false}
                reward={r}
                users={users}
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
            { key: "name",    label: "報酬名",      sortable: true },
            { key: "point",   label: "必要ポイント", sortable: true },
            { key: "whose",   label: "担当者" },
            { key: "actions", label: "" },
          ]}
          sortKey={sortKey}
          sortDir={sortDir}
          sortKey2={sortKey2}
          sortDir2={sortDir2}
          onSort={(k) => handleSort(k as SortKey)}
          onSort2={(k) => handleSort2(k as SortKey | null)}
        >
          {rewards.map((r) => (
            <tr key={r.id}>
              {editingId === r.id ? (
                <>
                  <td>
                    <TextInput
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </td>
                  <td>
                    <TextInput
                      type="number"
                      value={editForm.point}
                      onChange={(e) => setEditForm({ ...editForm, point: e.target.value })}
                      style={{ width: "100px" }}
                    />
                  </td>
                  <td>
                    <SelectInput value={editForm.whose} onChange={(e) => setEditForm({ ...editForm, whose: e.target.value })}>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.user}</option>
                      ))}
                    </SelectInput>
                  </td>
                  <td className="task-table__actions">
                    <Button variant="approve" disabled={isLoading} onClick={() => handleUpdate(r.id)}>保存</Button>
                    <Button variant="logout" onClick={() => setEditingId(null)}>キャンセル</Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{r.name}</td>
                  <td>{r.point}pt</td>
                  <td>{userName(r.whose)}</td>
                  <td className="task-table__actions">
                    <Button variant="primary" disabled={isLoading} onClick={() => startEdit(r)}>編集</Button>
                    <Button variant="disapprove" disabled={isLoading} onClick={() => handleDelete(r.id)}>削除</Button>
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
