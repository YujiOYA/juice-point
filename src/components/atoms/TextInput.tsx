interface Props {
  id?: string;
  name?: string;
  type?: string;
  value?: string | number;
  readOnly?: boolean;
  className?: string;
}

export default function TextInput({
  id,
  name,
  type = "text",
  value,
  readOnly,
  className = "input",
}: Props) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      readOnly={readOnly}
      className={className}
    />
  );
}
