import React, { memo } from "react";
import { Outlet } from "react-router-dom";

import Header from "../common/Header";
import Footer from "../common/Footer";

const FrontLayout = memo(function FrontLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-white text-neutral-900">
      <Header />

      <main role="main" className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
});

export default FrontLayout;
