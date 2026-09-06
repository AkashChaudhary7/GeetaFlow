import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[GeetaFlow ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-neutral-950 text-amber-50 flex items-center justify-center p-6 select-none font-sans">
          <div className="max-w-md w-full bg-neutral-900/90 border border-amber-500/20 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            
            <h2 className="text-xl font-bold font-serif text-amber-300 mb-2">
              ॥ शान्तिः शान्तिः शान्तिः ॥
            </h2>
            
            <p className="text-neutral-300 text-sm mb-6 leading-relaxed">
              एक अप्रत्याशित समस्या उत्पन्न हुई। कृपया पुनः प्रयास करें।
            </p>

            <button
              onClick={this.handleReset}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-semibold text-sm shadow-md transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>पुनः लोड करें (Reload)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

