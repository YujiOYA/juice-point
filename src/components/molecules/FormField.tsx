import React from "react";

interface Props {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}

export default function FormField({ label, htmlFor, children }: Props) {
  return (
    <div>
      <label className="task-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}
