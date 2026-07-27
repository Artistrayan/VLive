import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Safely notify Telegram WebApp if available
try {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    if (typeof window.Telegram.WebApp.ready === 'function') {
      window.Telegram.WebApp.ready();
    }
    if (typeof window.Telegram.WebApp.expand === 'function') {
      window.Telegram.WebApp.expand();
    }
  }
} catch (e) {
  console.warn("Telegram WebApp safely captured:", e);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
