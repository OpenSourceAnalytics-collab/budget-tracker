import { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/utils/format';
import { PiggyBank, Plus, Pencil, Trash2 } from 'lucide-react';

export function Savings() {
  const { data, addSavingsGoal, updateSavingsGoal, removeSavingsGoal } = useAppData();
  const currency = data.settings?.currency || 'USD';
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const openAdd = () => {
    setEditing(null);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate('');
    setModalOpen(true);
  };

  const openEdit = (goal) => {
    setEditing(goal);
    setName(goal.name);
    setTargetAmount(String(goal.targetAmount));
    setCurrentAmount(String(goal.currentAmount));
    setTargetDate(goal.targetDate || '');
    setModalOpen(true);
  };

  const save = () => {
    const target = Number(targetAmount) || 0;
    const current = Number(currentAmount) || 0;
    if (!name.trim()) return;
    if (editing) {
      updateSavingsGoal(editing.id, {
        name: name.trim(),
        targetAmount: target,
        currentAmount: current,
        targetDate: targetDate || undefined,
      });
    } else {
      addSavingsGoal({
        name: name.trim(),
        targetAmount: target,
        currentAmount: current,
        targetDate: targetDate || undefined,
      });
    }
    setModalOpen(false);
  };

  const totalCurrent = data.savings.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = data.savings.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <div className="space-y-8">
      {data.savings.length > 0 && (
        <Card>
          <CardHeader title="Total savings" />
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-content">
              {formatCurrency(totalCurrent, currency)}
            </p>
            {totalTarget > 0 && (
              <ProgressBar
                value={totalCurrent}
                max={totalTarget}
                label="Overall progress"
                className="mt-4"
              />
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Savings goals"
          action={
            <Button size="sm" onClick={openAdd} leftIcon={<Plus className="h-4 w-4" />}>
              Add goal
            </Button>
          }
        />
        <CardContent>
          {data.savings.length === 0 ? (
            <EmptyState
              icon={<PiggyBank className="h-6 w-6" />}
              title="No savings goals"
              description="Create goals (e.g. Emergency fund, Vacation) and track progress."
              actionLabel="Add goal"
              onAction={openAdd}
            />
          ) : (
            <div className="space-y-4">
              {data.savings.map((goal) => (
                <div
                  key={goal.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-content">{goal.name}</p>
                    {goal.targetDate && (
                      <p className="text-sm text-content-muted">
                        Target date: {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    )}
                    <ProgressBar
                      value={goal.currentAmount}
                      max={goal.targetAmount}
                      variant={goal.currentAmount >= goal.targetAmount ? 'success' : 'default'}
                      className="mt-2"
                    />
                    <p className="mt-1 font-mono text-sm tabular-nums text-content-muted">
                      {formatCurrency(goal.currentAmount, currency)} / {formatCurrency(goal.targetAmount, currency)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(goal)}
                      aria-label={`Edit ${goal.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSavingsGoal(goal.id)}
                      aria-label={`Delete ${goal.name}`}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit goal' : 'Add savings goal'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Goal name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emergency fund"
          />
          <Input
            label={`Target amount (${currency})`}
            type="number"
            min={0}
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
          <Input
            label={`Current amount (${currency})`}
            type="number"
            min={0}
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
          />
          <Input
            label="Target date (optional)"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

