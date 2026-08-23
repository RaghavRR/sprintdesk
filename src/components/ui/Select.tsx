import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, id, required, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const errorId = `${selectId}-error`;

    return (
      <div className="w-full">
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-paper-200">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`focus-ring w-full rounded-lg border px-3 py-2 text-sm text-ink-950 disabled:cursor-not-allowed disabled:bg-ink-950/5 dark:text-paper-100 dark:disabled:bg-paper-100/5 ${
            error ? 'border-red-400 bg-red-50 dark:border-red-800 dark:bg-red-950/20' : 'border-ink-950/15 bg-white dark:border-paper-100/15 dark:bg-ink-900'
          } ${className}`}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={errorId} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';
