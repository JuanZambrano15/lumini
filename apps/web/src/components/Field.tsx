import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

const inputClass =
  'w-full rounded-xl border-2 border-brand-200 bg-white px-4 py-2.5 text-ink focus:border-brand-500 focus:outline-none';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function TextField({ label, hint, id, ...props }: FieldProps) {
  const fieldId = id ?? props.name;
  return (
    <label htmlFor={fieldId} className="flex flex-col gap-1">
      <span className="text-sm font-bold text-brand-900">{label}</span>
      <input id={fieldId} className={inputClass} {...props} />
      {hint && <span className="text-xs text-ink/70">{hint}</span>}
    </label>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function SelectField({ label, options, id, ...props }: SelectProps) {
  const fieldId = id ?? props.name;
  return (
    <label htmlFor={fieldId} className="flex flex-col gap-1">
      <span className="text-sm font-bold text-brand-900">{label}</span>
      <select id={fieldId} className={inputClass} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
