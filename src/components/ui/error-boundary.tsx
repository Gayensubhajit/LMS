"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ───────────────────────────────────────────────────────────────────

type Props = {
  children: ReactNode;
  /** Custom fallback UI to render when an error is caught */
  fallback?: ReactNode;
  /** Called when an error is caught — useful for sending to a reporting service */
  onError?: (error: Error, info: ErrorInfo) => void;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

// ─── ErrorBoundary Class Component ───────────────────────────────────────────

/**
 * A React Error Boundary that catches uncaught render-time errors in its
 * subtree and displays a friendly fallback UI instead of crashing the page.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeComponentThatMightCrash />
 *   </ErrorBoundary>
 *
 * With custom fallback:
 *   <ErrorBoundary fallback={<p>Custom error message</p>}>
 *     <ComponentThatMightFail />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
    // In production, you would send to an error reporting service here, e.g.:
    // Sentry.captureException(error, { extra: info });
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}

// ─── Default Fallback UI ─────────────────────────────────────────────────────

type FallbackProps = {
  error: Error | null;
  onReset: () => void;
};

function DefaultErrorFallback({ error, onReset }: FallbackProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-red-800 dark:text-red-200">Something went wrong</h3>
        <p className="text-sm text-red-600/80 dark:text-red-400/80">
          {process.env.NODE_ENV !== "production" && error?.message
            ? error.message
            : "An unexpected error occurred. Please try again."}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="gap-2 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </Button>
    </div>
  );
}

// ─── Convenience hook-friendly wrapper ───────────────────────────────────────

/**
 * Wraps children with an ErrorBoundary with a compact inline fallback.
 * Use for non-critical UI sections where a full crash should be isolated.
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `WithErrorBoundary(${displayName})`;
  return WithErrorBoundary;
}
