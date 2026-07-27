import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("V.Live+ Render Error:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.warn("Storage clear error:", e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#090d16',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'Vazirmatn, sans-serif',
          textAlign: 'center',
          direction: 'rtl'
        }}>
          <div style={{
            maxWidth: '380px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(0, 243, 255, 0.4)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(16px)'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#00f3ff' }}>
              مشکل در بارگذاری برنامه
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.6' }}>
              برای بازنشانی و بارگذاری مجدد لطفاً دکمه زیر را کلیک کنید.
            </p>

            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #00f3ff, #0096ff)',
                color: '#090d16',
                fontWeight: 'bold',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(0,243,255,0.4)'
              }}
            >
              بازنشانی و شروع مجدد
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Telegram WebApp safe init
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
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
