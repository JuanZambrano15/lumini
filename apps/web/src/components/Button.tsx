import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'sun';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-[0_4px_0_var(--color-brand-900)]',
  secondary: 'bg-white text-brand-700 ring-2 ring-brand-300 hover:bg-brand-50',
  ghost: 'bg-transparent text-brand-700 hover:bg-brand-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  sun: 'bg-sun text-ink hover:brightness-105 shadow-[0_4px_0_#c9a800]',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2 font-bold transition active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
