import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  CreditCard,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react';

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'savings', label: 'Savings', icon: PiggyBank },
  { id: 'debt', label: 'Debt', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Layout({ currentPage, onNavigate, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [dark]);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar overlay (mobile) */}
      <div
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        aria-hidden={!sidebarOpen}
        style={{ opacity: sidebarOpen ? 1 : 0, pointerEvents: sidebarOpen ? 'auto' : 'none' }}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-surface-elevated
          transition-transform duration-200 ease-out lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4 lg:px-5">
          <span className="font-semibold text-content">Budget Tracker</span>
          <button
            type="button"
            className="rounded-lg p-2 text-content-muted hover:bg-surface-muted hover:text-content lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-0.5 p-3" aria-label="Main">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                onNavigate(id);
                setSidebarOpen(false);
              }}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium
                transition-colors
                ${
                  currentPage === id
                    ? 'bg-brand-500/12 text-brand-600 dark:text-brand-400'
                    : 'text-content-muted hover:bg-surface-muted hover:text-content'
                }
              `}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface-elevated/80 px-4 backdrop-blur-sm lg:px-8">
          <button
            type="button"
            className="rounded-lg p-2 text-content-muted hover:bg-surface-muted hover:text-content lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg font-semibold text-content capitalize">
              {currentPage === 'overview' && 'Overview'}
              {currentPage === 'budget' && 'Budget'}
              {currentPage === 'savings' && 'Savings'}
              {currentPage === 'debt' && 'Debt'}
              {currentPage === 'settings' && 'Settings'}
            </h1>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-content-muted hover:bg-surface-muted hover:text-content"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

