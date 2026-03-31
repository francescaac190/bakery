type ChipOption = {
  label: string;
  value: string;
};

type SingleProps = {
  label?: string;
  options: ChipOption[];
  multi?: false;
  value: string | null;
  onChange: (value: string) => void;
};

type MultiProps = {
  label?: string;
  options: ChipOption[];
  multi: true;
  value: string[];
  onChange: (value: string[]) => void;
};

type ChipSelectorProps = SingleProps | MultiProps;

export default function ChipSelector(props: ChipSelectorProps) {
  const { label, options, multi } = props;

  function isSelected(val: string) {
    if (multi) return (props.value as string[]).includes(val);
    return props.value === val;
  }

  function handleClick(val: string) {
    if (multi) {
      const current = props.value as string[];
      const next = current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val];
      (props as MultiProps).onChange(next);
    } else {
      (props as SingleProps).onChange(val);
    }
  }

  return (
    <div>
      {label && (
        <p className="font-medium text-sm text-text-primary mb-2">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = isSelected(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleClick(opt.value)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selected
                  ? "bg-background4 text-text-primary font-semibold border border-border-subtle"
                  : "bg-background3 text-text-secondary font-normal border border-border-subtle hover:bg-background4"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
