import React, { Suspense, memo } from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./app/ErrorBoundary";
import AppRouter from "./app/router";

const App = memo(function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen w-full bg-[#FAFAF9]" />}>
          <AppRouter />
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
});

export default App;