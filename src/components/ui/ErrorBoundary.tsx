"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught:", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <p className="text-lg font-semibold text-zinc-300">
            Something went wrong
          </p>
          <p className="mt-2 max-w-md text-sm text-zinc-500">
            An unexpected error occurred. Please try again.
          </p>
          <button
            className="mt-6 rounded-md bg-[#22c55e]/10 px-6 py-2 text-sm font-medium text-[#22c55e] transition-colors hover:bg-[#22c55e]/20"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
