# Budget Tracker

A **budget, savings, and debt tracker** with a clean, enterprise-grade UI. Built with React, TypeScript, and Vite. Data is stored in your browser (localStorage); no backend or database required.

## Features

- **Budget** — Set monthly income and category-based spending (planned vs spent) with progress bars
- **Savings** — Define goals with target amounts and optional target dates; track progress
- **Debt** — Track balances, interest rates, and minimum payments
- **Overview** — Dashboard with income, spending, savings, debt, cash flow, and net worth
- **Settings** — Export/import JSON backup, reset data, dark/light theme

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

Output is in `dist/`.

## Tech stack

- React 18, Vite
- Tailwind CSS, Lucide icons
- localStorage for persistence; export/import for backup

## License

MIT
