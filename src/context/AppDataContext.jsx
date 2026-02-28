import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_APP_DATA } from '@/types';

const STORAGE_KEY = 'budget-tracker-data';

const AppDataContext = createContext(null);

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeAppData(raw) {
  const safe = raw && typeof raw === 'object' ? raw : {};
  const safeBudget = safe.budget && typeof safe.budget === 'object' ? safe.budget : {};

  return {
    ...DEFAULT_APP_DATA,
    ...safe,
    settings: {
      ...DEFAULT_APP_DATA.settings,
      ...(safe.settings && typeof safe.settings === 'object' ? safe.settings : {}),
    },
    budget: {
      ...DEFAULT_APP_DATA.budget,
      ...safeBudget,
      categories: Array.isArray(safeBudget.categories) ? safeBudget.categories : [],
    },
    savings: Array.isArray(safe.savings) ? safe.savings : [],
    debt: Array.isArray(safe.debt) ? safe.debt : [],
  };
}

export function AppDataProvider({ children }) {
  const [rawData, setData] = useLocalStorage(STORAGE_KEY, DEFAULT_APP_DATA);
  const data = normalizeAppData(rawData);

  const updateBudget = useCallback(
    (payload) => {
      setData((prev) => ({
        ...prev,
        budget:
          typeof payload === 'function'
            ? payload(prev.budget)
            : { ...prev.budget, ...payload },
      }));
    },
    [setData],
  );

  const updateSettings = useCallback(
    (payload) => {
      setData((prev) => {
        const currentSettings =
          prev.settings && typeof prev.settings === 'object'
            ? prev.settings
            : DEFAULT_APP_DATA.settings;

        return {
          ...prev,
          settings:
            typeof payload === 'function'
              ? payload(currentSettings)
              : { ...currentSettings, ...payload },
        };
      });
    },
    [setData],
  );

  const addCategory = useCallback(
    (category) => {
      setData((prev) => ({
        ...prev,
        budget: {
          ...prev.budget,
          categories: [...prev.budget.categories, { ...category, id: generateId() }],
        },
      }));
    },
    [setData],
  );

  const updateCategory = useCallback(
    (id, updates) => {
      setData((prev) => ({
        ...prev,
        budget: {
          ...prev.budget,
          categories: prev.budget.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        },
      }));
    },
    [setData],
  );

  const removeCategory = useCallback(
    (id) => {
      setData((prev) => ({
        ...prev,
        budget: {
          ...prev.budget,
          categories: prev.budget.categories.filter((c) => c.id !== id),
        },
      }));
    },
    [setData],
  );

  const addSavingsGoal = useCallback(
    (goal) => {
      setData((prev) => ({
        ...prev,
        savings: [...prev.savings, { ...goal, id: generateId() }],
      }));
    },
    [setData],
  );

  const updateSavingsGoal = useCallback(
    (id, updates) => {
      setData((prev) => ({
        ...prev,
        savings: prev.savings.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      }));
    },
    [setData],
  );

  const removeSavingsGoal = useCallback(
    (id) => {
      setData((prev) => ({
        ...prev,
        savings: prev.savings.filter((s) => s.id !== id),
      }));
    },
    [setData],
  );

  const addDebt = useCallback(
    (debt) => {
      setData((prev) => ({
        ...prev,
        debt: [...prev.debt, { ...debt, id: generateId() }],
      }));
    },
    [setData],
  );

  const updateDebt = useCallback(
    (id, updates) => {
      setData((prev) => ({
        ...prev,
        debt: prev.debt.map((d) => (d.id === id ? { ...d, ...updates } : d)),
      }));
    },
    [setData],
  );

  const removeDebt = useCallback(
    (id) => {
      setData((prev) => ({
        ...prev,
        debt: prev.debt.filter((d) => d.id !== id),
      }));
    },
    [setData],
  );

  const exportData = useCallback(() => JSON.stringify(data, null, 2), [data]);

  const importData = useCallback(
    (json) => {
      try {
        const parsed = JSON.parse(json);
        if (
          parsed &&
          typeof parsed === 'object' &&
          Array.isArray(parsed.savings) &&
          Array.isArray(parsed.debt) &&
          parsed.budget &&
          Array.isArray(parsed.budget.categories)
        ) {
          setData(normalizeAppData(parsed));
          return true;
        }
      } catch {
        // ignore parse errors
      }
      return false;
    },
    [setData],
  );

  const resetData = useCallback(() => setData(DEFAULT_APP_DATA), [setData]);

  const value = {
    data,
    setData,
    updateSettings,
    updateBudget,
    addCategory,
    updateCategory,
    removeCategory,
    addSavingsGoal,
    updateSavingsGoal,
    removeSavingsGoal,
    addDebt,
    updateDebt,
    removeDebt,
    exportData,
    importData,
    resetData,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return ctx;
}

