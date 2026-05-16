interface Props {
    points: number;
}

export default function PointsBadge({ points }: Props) {
    return (
        <div className="points-badge">
            💰 {points} <span className="points-label">ポイント</span>
        </div>
    );
}
