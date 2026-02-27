import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppDataProvider } from '@/context/AppDataContext';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppDataProvider>
        <App />
      </AppDataProvider>
    </React.StrictMode>,
  );
}

