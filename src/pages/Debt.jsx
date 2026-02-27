import { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency, formatPercent } from '@/utils/format';
import { CreditCard, Plus, Pencil, Trash2 } from 'lucide-react';

export function Debt() {
  const { data, addDebt, updateDebt, removeDebt } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minPayment, setMinPayment] = useState('');

  const openAdd = () => {
    setEditing(null);
    setName('');
    setBalance('');
    setInterestRate('');
    setMinPayment('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setName(item.name);
    setBalance(String(item.balance));
    setInterestRate(String(item.interestRate));
    setMinPayment(String(item.minPayment));
    setModalOpen(true);
  };

  const save = () => {
    const b = Number(balance) || 0;
    const ir = Number(interestRate) || 0;
    const min = Number(minPayment) || 0;
    if (!name.trim()) return;
    if (editing) {
      updateDebt(editing.id, { name: name.trim(), balance: b, interestRate: ir, minPayment: min });
    } else {
      addDebt({ name: name.trim(), balance: b, interestRate: ir, minPayment: min });
    }
    setModalOpen(false);
  };

  const totalDebt = data.debt.reduce((s, d) => s + d.balance, 0);

  return (
    <div className="space-y-8">
      {data.debt.length > 0 && (
        <Card>
          <CardHeader title="Total debt" />
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums text-red-600 dark:text-red-400">
              {formatCurrency(totalDebt)}
            </p>
            <p className="mt-1 text-sm text-content-muted">
              Across {data.debt.length} account{data.debt.length !== 1 ? 's' : ''}.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader
          title="Debt accounts"
          action={
            <Button size="sm" onClick={openAdd} leftIcon={<Plus className="h-4 w-4" />}>
              Add debt
            </Button>
          }
        />
        <CardContent>
          {data.debt.length === 0 ? (
            <EmptyState
              icon={<CreditCard className="h-6 w-6" />}
              title="No debt tracked"
              description="Add credit cards, loans, or other debts to see totals and track payoff."
              actionLabel="Add debt"
              onAction={openAdd}
            />
          ) : (
            <div className="space-y-4">
              {data.debt.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4"
                >
                  <div>
                    <p className="font-medium text-content">{item.name}</p>
                    <p className="mt-1 font-mono text-lg tabular-nums text-content">
                      {formatCurrency(item.balance)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-content-muted">
                      <span>APR: {formatPercent(item.interestRate)}</span>
                      <span>Min. payment: {formatCurrency(item.minPayment)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(item)}
                      aria-label={`Edit ${item.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDebt(item.id)}
                      aria-label={`Delete ${item.name}`}
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
        title={editing ? 'Edit debt' : 'Add debt'}
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
            label="Account name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Credit card, Car loan"
          />
          <Input
            label="Current balance ($)"
            type="number"
            min={0}
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
          <Input
            label="Interest rate (APR %)"
            type="number"
            min={0}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
          <Input
            label="Minimum payment ($)"
            type="number"
            min={0}
            value={minPayment}
            onChange={(e) => setMinPayment(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

