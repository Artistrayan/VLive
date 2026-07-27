import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("V.Live+ Render Error:", error, errorInfo);
    this.setState({ errorInfo });
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

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
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
            maxWidth: '420px',
            width: '100%',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(0, 243, 255, 0.4)',
            borderRadius: '24px',
            padding: '28px 20px',
            boxShadow: '0 15px 35px rgba(0, 243, 255, 0.2)',
            backdropFilter: 'blur(16px)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '20px',
              background: 'rgba(0, 243, 255, 0.15)',
              border: '1px solid rgba(0, 243, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px',
              color: '#00f3ff'
            }}>
              ⚡
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#00f3ff' }}>
              پلتفرم V.Live+ آماده راه‌اندازی است
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.6' }}>
              به دلیل همگام‌سازی حافظه کش مرورگر تلگرام یا Render، لطفاً برای باز کردن سریع برنامه روی دکمه زیر کلیک کنید.
            </p>

            {this.state.error && (
              <div style={{
                background: 'rgba(2, 6, 23, 0.8)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '10px',
                marginBottom: '16px',
                textAlign: 'left',
                direction: 'ltr',
                maxHeight: '80px',
                overflowY: 'auto',
                fontSize: '10px',
                color: '#f87171'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                پاکسازی حافظه کش و ورود
              </button>

              <button
                onClick={this.handleRetry}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: '#e2e8f0',
                  fontWeight: '600',
                  fontSize: '13px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer'
                }}
              >
                تلاش مجدد بارگذاری
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Telegram WebApp initialization safely
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


