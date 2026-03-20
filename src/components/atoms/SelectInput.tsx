import React from "react";

interface Props {
  id?: string;
  className?: string;
  defaultValue?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

export default function SelectInput({
  id,
  className = "input",
  defaultValue,
  onChange,
  children,
}: Props) {
  return (
    <select
      id={id}
      className={className}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      {children}
    </select>
  );
}
