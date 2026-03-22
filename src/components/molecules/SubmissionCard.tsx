import Button from "@atom/Button";
import { Submission } from "@type/submission";

interface Props {
  submission: Submission;
  whoseName: string;
  isDoing: boolean;
  onApprove?: (id: string) => void;
  onDisapprove?: (id: string) => void;
  onRestore?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function SubmissionCard({
  submission: s,
  whoseName,
  isDoing,
  onApprove,
  onDisapprove,
  onRestore,
  onDelete,
}: Props) {
  return (
    <div className="submission-card">
      <p className="submission-card__task">{s.whatYouDid}</p>
      <div className="submission-card__meta">
        <span>👤 {whoseName}</span>
        <span>💰 {s.point}pt</span>
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
