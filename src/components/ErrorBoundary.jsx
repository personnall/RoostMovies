import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" style={{
          padding: '4rem',
          textAlign: 'center',
          backgroundColor: 'var(--secondary-bg)',
          borderRadius: '20px',
          margin: '2rem'
        }}>
          <h2>Something went wrong.</h2>
          <p style={{ color: 'var(--secondary-text)', margin: '1rem 0 2rem' }}>
            We're sorry, an unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            className="details-btn primary"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
