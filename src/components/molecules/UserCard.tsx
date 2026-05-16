import Button from "@atom/Button";
import SelectInput from "@atom/SelectInput";
import TextInput from "@atom/TextInput";
import { User } from "@type/user";

const authorityLabel = (a: string) => (a === "admin" ? "管理者" : "一般");

interface ViewProps {
    user: User;
    isLoading: boolean;
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
}

interface EditProps {
    user: User;
    editForm: { user: string; pin: string; authority: string };
    isLoading: boolean;
    onChangeForm: (form: { user: string; pin: string; authority: string }) => void;
    onSave: (id: string) => void;
    onCancel: () => void;
}

type Props = ({ isEditing: false } & ViewProps) | ({ isEditing: true } & EditProps);

export default function UserCard(props: Props) {
    if (props.isEditing) {
        const { user, editForm, isLoading, onChangeForm, onSave, onCancel } = props;
        return (
            <div className="task-card">
                <div className="task-card__edit-form">
                    <TextInput
                        placeholder="ユーザー名"
                        value={editForm.user}
                        onChange={(e) => onChangeForm({ ...editForm, user: e.target.value })}
                    />
                    <TextInput
                        type="password"
                        placeholder="PIN（変更しない場合は空欄）"
                        value={editForm.pin}
                        onChange={(e) => onChangeForm({ ...editForm, pin: e.target.value })}
                    />
                    <SelectInput
                        value={editForm.authority}
                        onChange={(e) => onChangeForm({ ...editForm, authority: e.target.value })}
                    >
                        <option value="user">一般</option>
                        <option value="admin">管理者</option>
                    </SelectInput>
                    <div className="task-card__actions">
                        <Button variant="approve" disabled={isLoading} onClick={() => onSave(user.id)}>
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

    const { user, isLoading, onEdit, onDelete } = props;
    return (
        <div className="task-card">
            <p className="task-card__name">{user.user}</p>
            <div className="task-card__meta">
                <span>🔑 {authorityLabel(user.authority)}</span>
            </div>
            <div className="task-card__actions">
                <Button variant="primary" disabled={isLoading} onClick={() => onEdit(user)}>
                    編集
                </Button>
                <Button variant="disapprove" disabled={isLoading} onClick={() => onDelete(user.id)}>
                    削除
                </Button>
            </div>
        </div>
    );
}
