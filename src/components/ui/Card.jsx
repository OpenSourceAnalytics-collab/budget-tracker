import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-border bg-surface-elevated shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action, className = '' }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b border-border px-5 py-4 ${className}`}
    >
      <h2 className="text-base font-semibold text-content">{title}</h2>
      {action}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

