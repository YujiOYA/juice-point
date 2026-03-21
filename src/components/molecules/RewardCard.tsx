import Button from "@atom/Button";
import SelectInput from "@atom/SelectInput";
import TextInput from "@atom/TextInput";
import { Reward } from "@type/reward";
import { User } from "@type/user";

interface ViewProps {
  reward: Reward;
  isLoading: boolean;
  onEdit: (reward: Reward) => void;
  onDelete: (id: string) => void;
}

interface EditProps {
  reward: Reward;
  editForm: { name: string; point: string; whose: string };
  users: User[];
  isLoading: boolean;
  onChangeForm: (form: { name: string; point: string; whose: string }) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
}

type Props = { isEditing: false } & ViewProps | { isEditing: true } & EditProps;

export default function RewardCard(props: Props) {
  if (props.isEditing) {
    const { reward, editForm, users, isLoading, onChangeForm, onSave, onCancel } = props;
    return (
      <div className="task-card">
        <div className="task-card__edit-form">
          <TextInput
            placeholder="報酬名"
            value={editForm.name}
            onChange={(e) => onChangeForm({ ...editForm, name: e.target.value })}
          />
          <TextInput
            type="number"
            placeholder="必要ポイント"
            value={editForm.point}
            onChange={(e) => onChangeForm({ ...editForm, point: e.target.value })}
          />
          <SelectInput value={editForm.whose} onChange={(e) => onChangeForm({ ...editForm, whose: e.target.value })}>
            <option value="" disabled>担当者を選択</option>
            {users.map((u) => (
              <option key={u.id} value={u.user}>{u.user}</option>
            ))}
          </SelectInput>
          <div className="task-card__actions">
            <Button variant="approve" disabled={isLoading} onClick={() => onSave(reward.id)}>
              保存
            </Button>
            <Button variant="logout" onClick={onCancel}>
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { reward, isLoading, onEdit, onDelete } = props;
  return (
    <div className="task-card">
      <p className="task-card__name">{reward.name}</p>
      <div className="task-card__meta">
        <span>💰 {reward.point}pt</span>
        <span>👤 {reward.whose}</span>
      </div>
      <div className="task-card__actions">
        <Button variant="primary" disabled={isLoading} onClick={() => onEdit(reward)}>
          編集
        </Button>
        <Button variant="disapprove" disabled={isLoading} onClick={() => onDelete(reward.id)}>
          削除
        </Button>
      </div>
    </div>
  );
}
