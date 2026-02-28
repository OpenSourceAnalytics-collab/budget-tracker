// Runtime shape and default data for the app.
// Kept minimal on purpose; all type-checking is done by React and JavaScript at runtime.

export const DEFAULT_APP_DATA = {
  settings: {
    currency: 'USD',
  },
  budget: {
    monthlyIncome: 0,
    categories: [],
  },
  savings: [],
  debt: [],
};

