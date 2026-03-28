interface Props {
  id?: string;
  name?: string;
  type?: string;
  value?: string | number;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
  step?: number | string;
  min?: number | string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
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
  step,
  min,
  onChange,
  onBlur,
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
      step={step}
      min={min}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}
