import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ink-950 text-paper hover:bg-ink-800 active:bg-ink-700 disabled:bg-ink-950/40 dark:bg-accent-400 dark:text-ink-950 dark:hover:bg-accent-300 dark:disabled:bg-accent-400/30',
  secondary:
    'bg-transparent text-ink-950 border border-ink-950/20 hover:bg-ink-950/5 active:bg-ink-950/10 dark:text-paper-100 dark:border-paper-100/20 dark:hover:bg-paper-100/10',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300',
  ghost:
    'bg-transparent text-ink-600 hover:bg-ink-950/5 dark:text-paper-200 dark:hover:bg-paper-100/10',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-2.5 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, leftIcon, disabled, className = '', children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`focus-ring inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...rest}
      >
        {isLoading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
