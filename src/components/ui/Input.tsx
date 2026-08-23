import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, required, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="w-full">
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-paper-200">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`focus-ring w-full rounded-lg border px-3 py-2 text-sm text-ink-950 placeholder:text-ink-600/40 disabled:cursor-not-allowed disabled:bg-ink-950/5 dark:text-paper-100 dark:placeholder:text-paper-100/30 dark:disabled:bg-paper-100/5 ${
            error
              ? 'border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
              : 'border-ink-950/15 bg-white dark:border-paper-100/15 dark:bg-ink-900'
          } ${className}`}
          {...rest}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="mt-1 text-sm text-ink-600/70 dark:text-paper-100/45">
            {hint}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
