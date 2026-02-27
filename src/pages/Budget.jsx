import { useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/utils/format';
import { Wallet, Plus, Pencil, Trash2 } from 'lucide-react';

export function Budget() {
  const { data, updateBudget, addCategory, updateCategory, removeCategory } = useAppData();
  const { budget } = data;
  const currency = data.settings?.currency || 'USD';
  const [incomeModal, setIncomeModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [incomeInput, setIncomeInput] = useState(String(budget.monthlyIncome || ''));
  const [catName, setCatName] = useState('');
  const [catPlanned, setCatPlanned] = useState('');
  const [catSpent, setCatSpent] = useState('0');

  const totalPlanned = budget.categories.reduce((s, c) => s + c.planned, 0);
  const totalSpent = budget.categories.reduce((s, c) => s + c.spent, 0);

  const openAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatPlanned('');
    setCatSpent('0');
    setCategoryModal(true);
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setCatName(category.name);
    setCatPlanned(String(category.planned));
    setCatSpent(String(category.spent));
    setCategoryModal(true);
  };

  const saveCategory = () => {
    const planned = Number(catPlanned) || 0;
    const spent = Number(catSpent) || 0;
    if (!catName.trim()) return;
    if (editingCategory) {
      updateCategory(editingCategory.id, { name: catName.trim(), planned, spent });
    } else {
      addCategory({ name: catName.trim(), planned, spent });
    }
    setCategoryModal(false);
  };

  const saveIncome = () => {
    const n = Number(incomeInput) || 0;
    updateBudget({ monthlyIncome: n });
    setIncomeModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Income */}
      <Card>
        <CardHeader
          title="Monthly income"
          action={
            <Button variant="ghost" size="sm" onClick={() => setIncomeModal(true)}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          }
        />
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums text-content">
            {formatCurrency(budget.monthlyIncome, currency)}
          </p>
        </CardContent>
      </Card>

      {/* Overall progress */}
      {budget.categories.length > 0 && (
        <Card>
          <CardHeader title="Spending overview" />
          <CardContent>
            <ProgressBar
              value={totalSpent}
              max={totalPlanned}
              label="Total spent vs planned"
            />
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      <Card>
        <CardHeader
          title="Budget categories"
          action={
            <Button size="sm" onClick={openAddCategory} leftIcon={<Plus className="h-4 w-4" />}>
              Add category
            </Button>
          }
        />
        <CardContent>
          {budget.categories.length === 0 ? (
            <EmptyState
              icon={<Wallet className="h-6 w-6" />}
              title="No categories yet"
              description="Add budget categories to track spending by type (e.g. Food, Transport, Rent)."
              actionLabel="Add category"
              onAction={openAddCategory}
            />
          ) : (
            <div className="space-y-4">
              {budget.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-surface p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-content">{cat.name}</p>
                    <ProgressBar
                      value={cat.spent}
                      max={cat.planned}
                      showValue={false}
                      className="mt-2"
                    />
                    <p className="mt-1 font-mono text-sm tabular-nums text-content-muted">
                      {formatCurrency(cat.spent, currency)} / {formatCurrency(cat.planned, currency)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditCategory(cat)}
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(cat.id)}
                      aria-label={`Delete ${cat.name}`}
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

      {/* Income modal */}
      <Modal
        open={incomeModal}
        onClose={() => setIncomeModal(false)}
        title="Monthly income"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIncomeModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveIncome}>Save</Button>
          </>
        }
      >
        <Input
          label={`Amount (${currency})`}
          type="number"
          min={0}
          step={1}
          value={incomeInput}
          onChange={(e) => setIncomeInput(e.target.value)}
          placeholder="0"
        />
      </Modal>

      {/* Category modal */}
      <Modal
        open={categoryModal}
        onClose={() => setCategoryModal(false)}
        title={editingCategory ? 'Edit category' : 'Add category'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCategoryModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveCategory}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Category name"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="e.g. Food, Transport"
          />
          <Input
            label={`Planned amount (${currency})`}
            type="number"
            min={0}
            value={catPlanned}
            onChange={(e) => setCatPlanned(e.target.value)}
          />
          <Input
            label={`Spent so far (${currency})`}
            type="number"
            min={0}
            value={catSpent}
            onChange={(e) => setCatSpent(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

