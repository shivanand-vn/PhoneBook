import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-md text-center">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-error-container/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-md bg-surface-container border border-error/30 rounded-xl p-lg relative shadow-md">
            <span className="material-symbols-outlined text-[48px] text-error mb-md animate-bounce">warning</span>
            <h2 className="font-headline-lg text-headline-lg text-error mb-xs">Render Interrupted</h2>
            <p className="text-sm text-on-surface-variant mb-lg">
              An unexpected execution error occurred while rendering this page component view.
            </p>
            <div className="flex gap-sm justify-center">
              <button
                onClick={this.handleReset}
                className="px-md h-[36px] bg-primary-container text-on-primary-container rounded font-label-md text-xs hover:opacity-95 transition-all flex items-center gap-xs shadow-[0_0_12px_rgba(184,227,233,0.15)]"
              >
                Reset Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
