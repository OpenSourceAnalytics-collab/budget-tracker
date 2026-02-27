import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Overview } from '@/pages/Overview';
import { Budget } from '@/pages/Budget';
import { Savings } from '@/pages/Savings';
import { Debt } from '@/pages/Debt';
import { Settings } from '@/pages/Settings';

function App() {
  const [page, setPage] = useState('overview');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {page === 'overview' && <Overview />}
      {page === 'budget' && <Budget />}
      {page === 'savings' && <Savings />}
      {page === 'debt' && <Debt />}
      {page === 'settings' && <Settings />}
    </Layout>
  );
}

export default App;

