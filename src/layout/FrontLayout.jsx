import React, { memo, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";

const FrontLayout = memo(function FrontLayout() {
  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:border focus:border-neutral-200 focus:rounded-md"
      >
        Skip to content
      </a>
      <Header />
      <main
        id="main-content"
        role="main"
        className="flex-1 w-full flex flex-col relative"
      >
        <div className="mx-auto w-full max-w-[1920px] flex-1 flex flex-col">
          <Suspense fallback={<LayoutLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
});

const LayoutLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
  </div>
);

export default FrontLayout;
