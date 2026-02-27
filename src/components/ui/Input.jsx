import React from 'react';

export function Input({ label, error, hint, id, className = '', ...props }) {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-content">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-lg border bg-surface px-3 py-2 text-content placeholder:text-content-muted
          transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20
          disabled:cursor-not-allowed disabled:opacity-60
          ${error ? 'border-red-500' : 'border-border'}
          ${className}
        `}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="mt-1 text-sm text-content-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

