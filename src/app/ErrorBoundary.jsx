import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV === "development") {
      console.error("UI Crash Log:", error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[100dvh] w-full items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-md scale-in-center overflow-hidden rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-gray-100 sm:p-12">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-50 p-4 text-red-500">
                <svg
                  className="h-10 w-10 md:h-12 md:w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
              Oops! Something went wrong
            </h1>
            <p className="mb-8 text-sm leading-relaxed text-gray-500 md:text-base">
              An unexpected error has occurred. Please try refreshing the page
              or return to the home screen.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Go to Home
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
