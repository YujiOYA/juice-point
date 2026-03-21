import Button from "@atom/Button";
import TextInput from "@atom/TextInput";
import { Reward } from "@type/reward";

interface ViewProps {
  reward: Reward;
  isLoading: boolean;
  onEdit: (reward: Reward) => void;
  onDelete: (id: string) => void;
}

interface EditProps {
  reward: Reward;
  editForm: { name: string; point: string };
  isLoading: boolean;
  onChangeForm: (form: { name: string; point: string }) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
}

type Props = { isEditing: false } & ViewProps | { isEditing: true } & EditProps;

export default function RewardCard(props: Props) {
  if (props.isEditing) {
    const { reward, editForm, isLoading, onChangeForm, onSave, onCancel } = props;
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
