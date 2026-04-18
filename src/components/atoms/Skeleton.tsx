interface Props {
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

export default function Skeleton({ width = "100%", height = "1em", borderRadius = "4px", style }: Props) {
  return <div className="skeleton" style={{ width, height, borderRadius, ...style }} />;
}
