import { useRef, useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Download, Upload, RotateCcw, AlertTriangle } from 'lucide-react';

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'PHP', label: 'Philippine Peso (PHP)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'JPY', label: 'Japanese Yen (JPY)' },
  { value: 'CAD', label: 'Canadian Dollar (CAD)' },
  { value: 'AUD', label: 'Australian Dollar (AUD)' },
  { value: 'NZD', label: 'New Zealand Dollar (NZD)' },
  { value: 'SGD', label: 'Singapore Dollar (SGD)' },
  { value: 'HKD', label: 'Hong Kong Dollar (HKD)' },
  { value: 'CNY', label: 'Chinese Yuan (CNY)' },
  { value: 'INR', label: 'Indian Rupee (INR)' },
  { value: 'AED', label: 'UAE Dirham (AED)' },
  { value: 'SAR', label: 'Saudi Riyal (SAR)' },
];

export function Settings() {
  const { data, updateSettings, exportData, importData, resetData } = useAppData();
  const fileInputRef = useRef(null);
  const [importResult, setImportResult] = useState(null); // 'success' | 'error' | null
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const currency = data.settings?.currency || 'USD';

  const handleExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(reader.result);
      setImportResult(ok ? 'success' : 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setImportResult(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetData();
    setResetModalOpen(false);
  };

  const handleCurrencyChange = (e) => {
    updateSettings({ currency: e.target.value });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader title="Preferences" />
        <CardContent className="space-y-2">
          <label htmlFor="currency" className="block text-sm font-medium text-content">
            Currency
          </label>
          <select
            id="currency"
            value={currency}
            onChange={handleCurrencyChange}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-content transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-content-muted">
            Amounts across your dashboard will use this currency.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Data" />
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="secondary" onClick={handleExport} leftIcon={<Download className="h-4 w-4" />}>
              Export backup
            </Button>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="h-4 w-4" />}
            >
              Import backup
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImport}
              aria-label="Import backup file"
            />
          </div>
          {importResult === 'success' && (
            <p className="text-sm text-green-600 dark:text-green-400">Import successful.</p>
          )}
          {importResult === 'error' && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Invalid file. Use a JSON backup from this app.
            </p>
          )}
          <p className="text-sm text-content-muted">
            Data is stored in your browser. Export a backup before clearing site data or switching devices.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Reset" />
        <CardContent>
          <Button
            variant="danger"
            onClick={() => setResetModalOpen(true)}
            leftIcon={<RotateCcw className="h-4 w-4" />}
          >
            Reset all data
          </Button>
          <p className="mt-2 text-sm text-content-muted">
            Permanently delete all your budget, savings, and debt data. Export a backup first if needed.
          </p>
        </CardContent>
      </Card>

      <Modal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset all data?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Reset
            </Button>
          </>
        }
      >
        <div className="flex gap-3 rounded-lg bg-amber-500/10 p-4 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">
            This will delete all your budget categories, savings goals, and debt entries. This cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
}

