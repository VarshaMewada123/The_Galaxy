import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { queryClient } from "./app/queryClient";
import { store, persistor } from "./store/store";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container missing");
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate
          loading={<div className="min-h-screen w-full" />}
          persistor={persistor}
        >
          <Suspense fallback={<div className="min-h-screen w-full" />}>
            <App />
          </Suspense>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
