import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-muted/50 py-16 px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-elevated text-content-muted">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-content">{title}</h3>
      <p className="max-w-sm text-sm text-content-muted">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-6" onClick={onAction} leftIcon={<Plus className="h-4 w-4" />}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

