import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 p-4">
          <Card className="max-w-lg w-full">
            <CardContent className="pt-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
                <div className="bg-gray-100 dark:bg-dark-800 p-4 rounded-lg mb-6 text-left">
                  <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto">
                    {this.state.error?.stack}
                  </pre>
                </div>
                <div className="space-x-4">
                  <Button onClick={this.handleReset}>
                    Go to Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Reload Page
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
