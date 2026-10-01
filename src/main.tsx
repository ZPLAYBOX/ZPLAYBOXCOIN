import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BloxMine App Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#000000',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: "'Poppins', sans-serif"
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: '#18181b',
            border: '2px solid #52525b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            marginBottom: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.8)'
          }}>
            ⚠️
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
            BloxMine Encountered an Issue
          </h1>
          <p style={{ fontSize: '13px', color: '#a1a1aa', maxWidth: '320px', marginBottom: '20px' }}>
            We caught an unexpected error. Tap below to reload your mining session.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 24px',
              borderRadius: '14px',
              backgroundColor: '#ffffff',
              color: '#000000',
              fontWeight: 'bold',
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Reload Game
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

