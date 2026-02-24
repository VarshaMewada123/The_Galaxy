import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

import ScrollToTop from "../layout/ScrollToTop";
import FrontLayout from "../layout/FrontLayout";
import Loader from "../components/loaders/Loader";
import Privacy from "../pages/PrivacyPolicyy";
import TermsOfUse from "../pages/TermsOfUse";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import VerifyOtp from "../pages/auth/VerifyOtp";
import Menu from "../pages/Menu";
const HomePage = lazy(() => import("../pages/HomePage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const DiningPage = lazy(() => import("../pages/DiningPage"));
const RoomsPage = lazy(() => import("../pages/RoomsPage"));
const OffersPage = lazy(() => import("../pages/OffersPage"));
// const LoginPage = lazy(() => import("../pages/LoginPage"));
// const SignupPage = lazy(() => import("../pages/SignupPage"));
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import Orders from "../pages/Orders";
import Contact from "../pages/Contactus";

const AdminLoginPage = lazy(() => import("../pages/AdminLoginPage"));

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route element={<FrontLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="dining" element={<DiningPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="offers" element={<OffersPage />} />
            {/* <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} /> */}
            <Route path="/privacyy" element={<Privacy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verify-otp" element={<VerifyOtp />} />
            <Route path="menu" element={<Menu />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
<Route path="/order-success" element={<OrderSuccess />} />
<Route path="/contact" element={<Contact />} />
          </Route>

          {/* ADMIN LOGIN */}
          <Route path="admin" element={<AdminLoginPage />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
