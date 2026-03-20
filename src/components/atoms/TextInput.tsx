interface Props {
  id?: string;
  name?: string;
  type?: string;
  value?: string | number;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({
  id,
  name,
  type = "text",
  value,
  placeholder,
  readOnly,
  className = "input",
  style,
  onChange,
}: Props) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      className={className}
      style={style}
      onChange={onChange}
    />
  );
}
