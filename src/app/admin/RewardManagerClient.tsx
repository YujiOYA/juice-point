"use client";

import Button from "@atom/Button";
import Card from "@atom/Card";
import TextInput from "@atom/TextInput";
import RewardCard from "@molecule/RewardCard";
import { useRewardManager } from "@hook/useRewardManager";
import { Reward } from "@type/reward";

interface Props {
  initialRewards: Reward[];
}

export default function RewardManagerClient({ initialRewards }: Props) {
  const {
    rewards,
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
          <Button type="submit" variant="primary" disabled={isLoading}>
            追加
          </Button>
        </form>
      </Card>

      {/* 報酬一覧 */}
      <section>
        <h2 style={{ marginBottom: "1rem" }}>報酬一覧</h2>

        {/* スマホ: カード */}
        <div className="task-list">
          {rewards.map((r) =>
            editingId === r.id ? (
              <RewardCard
                key={r.id}
                isEditing={true}
                reward={r}
                editForm={editForm}
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
              <th>報酬名</th>
              <th>必要ポイント</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
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
                    <td style={{ display: "flex", gap: "0.5rem" }}>
                      <Button variant="approve" disabled={isLoading} onClick={() => handleUpdate(r.id)}>
                        保存
                      </Button>
                      <Button variant="logout" onClick={() => setEditingId(null)}>
                        キャンセル
                      </Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{r.name}</td>
                    <td>{r.point}pt</td>
                    <td style={{ display: "flex", gap: "0.5rem" }}>
                      <Button variant="primary" disabled={isLoading} onClick={() => startEdit(r)}>
                        編集
                      </Button>
                      <Button variant="disapprove" disabled={isLoading} onClick={() => handleDelete(r.id)}>
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
