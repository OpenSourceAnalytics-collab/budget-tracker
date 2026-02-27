import { useAppData } from '@/context/AppDataContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/format';
import { Wallet, PiggyBank, CreditCard, TrendingUp } from 'lucide-react';

export function Overview() {
  const { data } = useAppData();
  const { budget, savings, debt } = data;
  const currency = data.settings?.currency || 'USD';

  const totalPlanned = budget.categories.reduce((s, c) => s + c.planned, 0);
  const totalSpent = budget.categories.reduce((s, c) => s + c.spent, 0);
  const totalSavings = savings.reduce((s, g) => s + g.currentAmount, 0);
  const totalSavingsTarget = savings.reduce((s, g) => s + g.targetAmount, 0);
  const totalDebt = debt.reduce((s, d) => s + d.balance, 0);
  const netFromBudget = budget.monthlyIncome - totalSpent;

  const cards = [
    {
      title: 'Monthly income',
      value: formatCurrency(budget.monthlyIncome, currency),
      icon: Wallet,
      sub:
        totalPlanned > 0
          ? `Planned spending: ${formatCurrency(totalPlanned, currency)}`
          : null,
    },
    {
      title: 'Spent this month',
      value: formatCurrency(totalSpent, currency),
      icon: TrendingUp,
      sub: totalPlanned > 0 ? `${((totalSpent / totalPlanned) * 100).toFixed(0)}% of planned` : null,
    },
    {
      title: 'Total savings',
      value: formatCurrency(totalSavings, currency),
      icon: PiggyBank,
      sub:
        totalSavingsTarget > 0
          ? `of ${formatCurrency(totalSavingsTarget, currency)} goal`
          : null,
    },
    {
      title: 'Total debt',
      value: formatCurrency(totalDebt, currency),
      icon: CreditCard,
      sub: debt.length > 0 ? `${debt.length} account(s)` : null,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ title, value, icon: Icon, sub }) => (
          <Card key={title}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-content-muted">{title}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-content">
                    {value}
                  </p>
                  {sub && <p className="mt-1 text-xs text-content-muted">{sub}</p>}
                </div>
                <div className="rounded-lg bg-brand-500/10 p-2.5 text-brand-600 dark:text-brand-400">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget breakdown bar */}
      {budget.categories.length > 0 && totalPlanned > 0 && (
        <Card>
          <CardHeader title="Budget by category" />
          <CardContent>
            <div className="space-y-4">
              {budget.categories.map((cat) => {
                const pct = cat.planned > 0 ? (cat.spent / cat.planned) * 100 : 0;
                const over = cat.spent > cat.planned;
                return (
                  <div key={cat.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-content">{cat.name}</span>
                      <span className="tabular-nums text-content-muted">
                        {formatCurrency(cat.spent, currency)} / {formatCurrency(cat.planned, currency)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className={`h-full rounded-full transition-all ${
                          over ? 'bg-red-500' : 'bg-brand-500'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Net / quick summary */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Cash flow (this month)" />
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums text-content">
              {netFromBudget >= 0 ? (
                <span className="text-green-600 dark:text-green-400">
                  +{formatCurrency(netFromBudget, currency)}
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">
                  {formatCurrency(netFromBudget, currency)}
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-content-muted">
              Income minus expenses. Positive = surplus; negative = deficit.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Net worth (savings − debt)" />
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums text-content">
              {totalSavings - totalDebt >= 0 ? (
                <span className="text-green-600 dark:text-green-400">
                  {formatCurrency(totalSavings - totalDebt, currency)}
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">
                  {formatCurrency(totalSavings - totalDebt, currency)}
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-content-muted">
              Savings total minus total debt.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

