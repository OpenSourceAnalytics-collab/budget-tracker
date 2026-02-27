import React from 'react';

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variants = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 dark:bg-brand-500 dark:text-slate-900 dark:hover:bg-brand-400',
  secondary:
    'border border-border bg-surface-elevated text-content hover:bg-surface-muted',
  ghost: 'text-content-muted hover:bg-surface-muted hover:text-content',
  danger:
    'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
};

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  const variantClass = variants[variant] ?? variants.primary;
  const sizeClass = sizes[size] ?? sizes.md;

  return (
    <button
      type={type}
      className={`${base} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {leftIcon && (
        <span className="shrink-0" aria-hidden>
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span className="shrink-0" aria-hidden>
          {rightIcon}
        </span>
      )}
    </button>
  );
}

