import { ReactNode } from "react";

interface Props {
  variant?: "default" | "add";
  className?: string;
  children: ReactNode;
}

export default function Card({ variant = "default", className, children }: Props) {
  const cls = ["card", variant === "add" && "card--add", className].filter(Boolean).join(" ");
  return <div className={cls}>{children}</div>;
}
