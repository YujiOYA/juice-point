import Button from "@atom/Button";
import { Submission, SubmissionType } from "@type/submission";

interface Props {
    submission: Submission;
    whoseName: string;
    isDoing: boolean;
    editablePoint?: string;
    onPointChange?: (point: string) => void;
    onApprove?: (id: string) => void;
    onDisapprove?: (id: string) => void;
    onRestore?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export default function SubmissionCard({
    submission: s,
    whoseName,
    isDoing,
    editablePoint,
    onPointChange,
    onApprove,
    onDisapprove,
    onRestore,
    onDelete,
}: Props) {
    return (
        <div className="submission-card">
            <p className="submission-card__task">
                {s.submissionType === SubmissionType.OneTimeTask && (
                    <>
                        <span
                            style={{
                                display: "inline-block",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                color: "#fff",
                                background: "#f59e0b",
                                borderRadius: "4px",
                                padding: "0.1rem 0.4rem",
                            }}
                        >
                            未登録タスク
                        </span>
                        <br />
                    </>
                )}
                {s.whatYouDid}
            </p>
            <div className="submission-card__meta">
                <span>👤 {whoseName}</span>
                {editablePoint !== undefined ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        💰
                        <input
                            type="number"
                            value={editablePoint}
                            onChange={(e) => onPointChange?.(e.target.value)}
                            style={{
                                width: "4rem",
                                padding: "0.1rem 0.3rem",
                                border: "1px solid #d1d5db",
                                borderRadius: "4px",
                                fontSize: "0.9rem",
                            }}
                        />
                        pt
                    </span>
                ) : (
                    <span>💰 {s.point}pt</span>
                )}
                <span>🕐 {new Date(s.createdAt).toLocaleString("ja-JP")}</span>
            </div>
            <div className="submission-card__actions">
                {onApprove && (
                    <Button variant="approve" disabled={isDoing} onClick={() => onApprove(s.id)}>
                        ✅ 承認
                    </Button>
                )}
                {onDisapprove && (
                    <Button variant="disapprove" disabled={isDoing} onClick={() => onDisapprove(s.id)}>
                        ❌ 却下
                    </Button>
                )}
                {onRestore && (
                    <Button variant="approve" disabled={isDoing} onClick={() => onRestore(s.id)}>
                        🔄 戻す
                    </Button>
                )}
                {onDelete && (
                    <Button variant="disapprove" disabled={isDoing} onClick={() => onDelete(s.id)}>
                        🗑️ 削除
                    </Button>
                )}
            </div>
        </div>
    );
}
