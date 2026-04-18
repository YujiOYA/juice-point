"use client";

import AdminTable from "@molecule/AdminTable";
import Button from "@atom/Button";
import Card from "@atom/Card";
import SelectInput from "@atom/SelectInput";
import Skeleton from "@atom/Skeleton";
import TextInput from "@atom/TextInput";
import RewardCard from "@molecule/RewardCard";
import { useRewardManager } from "@hook/useRewardManager";
import { Reward } from "@type/reward";
import { User } from "@type/user";
import { LABELS } from "@const/labels";

const L = LABELS.rewardManager;
const C = LABELS.common;

interface Props {
  users: User[];
  initialRewards: Reward[];
}

export default function RewardManagerClient({ users, initialRewards }: Props) {
  const userName = (id: string) => users.find((u) => u.id === id)?.user ?? id;

  const {
    rewards,
    isFetching,
    sortKey, sortDir, handleSort,
    sortKey2, sortDir2, handleSort2,
    filterWhose, setFilterWhose,
    form, setForm,
    editingId, setEditingId,
    editForm, setEditForm,
    isLoading,
    handleCreate, startEdit, handleUpdate, handleDelete,
  } = useRewardManager(initialRewards);

  const SKELETON_COUNT = 3;

  type SortKey = "name" | "point";
  const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "name",  label: L.sortByName },
    { value: "point", label: L.sortByPoint },
  ];

  return (
    <div>
      {/* 追加フォーム */}
      <Card variant="add" className="task-add-card">
        <h2 style={{ marginBottom: "1rem" }}>{L.headingAdd}</h2>
        <form onSubmit={handleCreate} className="task-add-form">
          <TextInput
            placeholder={L.placeholderName}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextInput
            placeholder={L.placeholderPoint}
            type="number"
            value={form.point}
            onChange={(e) => setForm({ ...form, point: e.target.value })}
            style={{ maxWidth: "150px" }}
          />
          <SelectInput value={form.whose} onChange={(e) => setForm({ ...form, whose: e.target.value })}>
            <option value="" disabled>{C.selectPerson}</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.user}</option>
            ))}
          </SelectInput>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {C.add}
          </Button>
        </form>
      </Card>

      {/* 報酬一覧 */}
      <section>
        <h2 style={{ marginBottom: "1rem" }}>{L.headingList}</h2>

        {/* フィルター */}
        <div className="task-filter-bar">
          <span className="task-sort-label">{C.filterPerson}</span>
          <SelectInput value={filterWhose} onChange={(e) => setFilterWhose(e.target.value)}>
            <option value="">{C.filterAll}</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.user}</option>
            ))}
          </SelectInput>
        </div>

        {/* スマホ: ソート */}
        <div className="task-sort-bar">
          <span className="task-sort-label">{C.sortFirst}</span>
          <SelectInput value={sortKey} onChange={(e) => handleSort(e.target.value as SortKey)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </SelectInput>
          <Button variant="logout" onClick={() => handleSort(sortKey)}>
            {sortDir === "asc" ? C.sortAsc : C.sortDesc}
          </Button>
        </div>
        <div className="task-sort-bar">
          <span className="task-sort-label">{C.sortSecond}</span>
          <SelectInput
            value={sortKey2 ?? ""}
            onChange={(e) => handleSort2((e.target.value || null) as SortKey | null)}
          >
            <option value="">{C.sortNone}</option>
            {SORT_OPTIONS.filter((o) => o.value !== sortKey).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </SelectInput>
          {sortKey2 && (
            <Button variant="logout" onClick={() => handleSort2(sortKey2)}>
              {sortDir2 === "asc" ? C.sortAsc : C.sortDesc}
            </Button>
          )}
        </div>

        {/* スマホ: カード */}
        <div className="task-list">
          {isFetching
            ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <div key={i} className="card" style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <Skeleton height="1.1rem" width="55%" />
                  <Skeleton height="0.9rem" width="25%" />
                  <Skeleton height="0.9rem" width="35%" />
                </div>
              ))
            : rewards.map((r) =>
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
              )
          }
        </div>

        {/* PC: テーブル */}
        <AdminTable
          columns={[
            { key: "name",    label: L.colName,   sortable: true },
            { key: "point",   label: L.colPoint,  sortable: true },
            { key: "whose",   label: L.colPerson },
            { key: "actions", label: "" },
          ]}
          sortKey={sortKey}
          sortDir={sortDir}
          sortKey2={sortKey2}
          sortDir2={sortDir2}
          onSort={(k) => handleSort(k as SortKey)}
          onSort2={(k) => handleSort2(k as SortKey | null)}
        >
          {isFetching
            ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <tr key={i}>
                  <td><Skeleton height="1rem" /></td>
                  <td><Skeleton height="1rem" width="60px" /></td>
                  <td><Skeleton height="1rem" width="80px" /></td>
                  <td />
                </tr>
              ))
            : rewards.map((r) => (
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
                    <Button variant="approve" disabled={isLoading} onClick={() => handleUpdate(r.id)}>{C.save}</Button>
                    <Button variant="logout" onClick={() => setEditingId(null)}>{C.cancel}</Button>
                  </td>
                </>
              ) : (
                <>
                  <td>{r.name}</td>
                  <td>{r.point}pt</td>
                  <td>{userName(r.whose)}</td>
                  <td className="task-table__actions">
                    <Button variant="primary" disabled={isLoading} onClick={() => startEdit(r)}>{C.edit}</Button>
                    <Button variant="disapprove" disabled={isLoading} onClick={() => handleDelete(r.id)}>{C.delete}</Button>
                  </td>
                </>
              )}
            </tr>
          ))
          }
        </AdminTable>
      </section>
    </div>
  );
}
