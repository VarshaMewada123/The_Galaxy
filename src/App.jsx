import React, { Suspense, memo } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ErrorBoundary from "./app/ErrorBoundary";
import AppRouter from "./app/router";

const App = memo(function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontSize: "13px",
            },
          }}
        />

        <Suspense fallback={<div className="min-h-screen w-full" />}>
          <AppRouter />
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
});

export default App;
