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
    } catch (e) {}
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
          padding: '24px',
          fontFamily: 'Vazirmatn, sans-serif',
          textAlign: 'center',
          direction: 'rtl'
        }}>
          <div style={{
            maxWidth: '400px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(0, 243, 255, 0.3)',
            borderRadius: '24px',
            padding: '32px 24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#00f3ff' }}>
              برنامه V.Live+ نیاز به بازنشانی دارد
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6' }}>
              به دلیل تغییرات سرور یا حافظه کش مرورگر تلگرام، لطفاً روی دکمه زیر کلیک کنید تا برنامه دوباره بارگذاری شود.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #00f3ff, #0096ff)',
                color: '#090d16',
                fontWeight: 'bold',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(0,243,255,0.4)'
              }}
            >
              بازنشانی و ورود مجدد
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Telegram WebApp expand initialization
try {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
} catch (e) {
  console.log("Telegram WebApp init warning:", e);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

