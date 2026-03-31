type InputProps = {
  label: string;
  value?: string;
  helperText?: string;
  onChange?: (value: string) => void;
  className?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "time"
    | "datetime-local"
    | string;
} & React.InputHTMLAttributes<HTMLInputElement>;
export default function input({
  label,
  value,
  helperText,
  onChange,
  className,
  type = "text",
  ...props
}: InputProps) {
  return (
    <div className={`flex flex-col ${className || ""}`}>
      <label className={`font-medium text-sm text-text-primary`}>{label}</label>
      <input
        {...props}
        type={type}
        className="w-full rounded-lg border border-border-subtle bg-background3 p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-accent-soft focus:border-transparent"
        value={value}
        placeholder={helperText ?? undefined}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
