import Button from "@atom/Button";
import SelectInput from "@atom/SelectInput";
import TextInput from "@atom/TextInput";
import { Task } from "@type/task";
import { User } from "@type/user";

interface ViewProps {
    task: Task;
    users: User[];
    isLoading: boolean;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

interface EditProps {
    task: Task;
    editForm: { task: string; point: string; whose: string };
    users: User[];
    isLoading: boolean;
    onChangeForm: (form: { task: string; point: string; whose: string }) => void;
    onSave: (id: string) => void;
    onCancel: () => void;
}

type Props = ({ isEditing: false } & ViewProps) | ({ isEditing: true } & EditProps);

export default function TaskCard(props: Props) {
    if (props.isEditing) {
        const { task, editForm, users, isLoading, onChangeForm, onSave, onCancel } = props;
        return (
            <div className="task-card">
                <div className="task-card__edit-form">
                    <TextInput
                        placeholder="タスク名"
                        value={editForm.task}
                        onChange={(e) => onChangeForm({ ...editForm, task: e.target.value })}
                    />
                    <TextInput
                        type="number"
                        placeholder="ポイント"
                        value={editForm.point}
                        onChange={(e) => onChangeForm({ ...editForm, point: e.target.value })}
                    />
                    <SelectInput
                        value={editForm.whose}
                        onChange={(e) => onChangeForm({ ...editForm, whose: e.target.value })}
                    >
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.user}
                            </option>
                        ))}
                    </SelectInput>
                    <div className="task-card__actions">
                        <Button variant="approve" disabled={isLoading} onClick={() => onSave(task.id)}>
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

    const { task, users, isLoading, onEdit, onDelete } = props;
    const whoseName = users.find((u) => u.id === task.whose)?.user ?? task.whose;
    return (
        <div className="task-card">
            <p className="task-card__name">{task.task}</p>
            <div className="task-card__meta">
                <span>💰 {task.point}pt</span>
                <span>👤 {whoseName}</span>
            </div>
            <div className="task-card__actions">
                <Button variant="primary" disabled={isLoading} onClick={() => onEdit(task)}>
                    編集
                </Button>
                <Button variant="disapprove" disabled={isLoading} onClick={() => onDelete(task.id)}>
                    削除
                </Button>
            </div>
        </div>
    );
}
