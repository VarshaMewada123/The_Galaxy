import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./app/ErrorBoundary";
import AppRouter from "./app/router";


function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRouter />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
