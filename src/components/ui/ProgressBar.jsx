const variantColors = {
  default: 'bg-brand-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export function ProgressBar({
  value,
  max,
  label,
  showValue = true,
  variant = 'default',
  className = '',
}) {
  const pct = max <= 0 ? 0 : Math.min(100, (value / max) * 100);
  const effectiveVariant =
    variant === 'default' && max > 0
      ? pct > 100
        ? 'danger'
        : pct >= 90
        ? 'warning'
        : 'default'
      : variant;

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          {label && <span className="text-sm text-content-muted">{label}</span>}
          {showValue && (
            <span className="font-mono text-sm tabular-nums text-content">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className={`h-full rounded-full transition-all duration-300 ${variantColors[effectiveVariant]}`}
          style={{ width: `${Math.min(100, pct)}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

