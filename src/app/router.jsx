import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

import ScrollToTop from "../layout/ScrollToTop";
import FrontLayout from "../layout/FrontLayout";

const HomePage = lazy(() => import("../pages/HomePage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const DiningPage = lazy(() => import("../pages/DiningPage"));
const RoomsPage = lazy(() => import("../pages/RoomsPage"));
const OffersPage = lazy(() => import("../pages/OffersPage"));

const Privacy = lazy(() => import("../pages/PrivacyPolicyy"));
const TermsOfUse = lazy(() => import("../pages/TermsOfUse"));

const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const VerifyOtp = lazy(() => import("../pages/auth/VerifyOtp"));

const Menu = lazy(() => import("../pages/Menu"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Orders = lazy(() => import("../pages/Orders"));
const OrderSuccess = lazy(() => import("../pages/OrderSuccess"));
const Contact = lazy(() => import("../pages/Contactus"));

const AdminLoginPage = lazy(() => import("../pages/AdminLoginPage"));

export default function AppRouter() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route element={<FrontLayout />}>
          <Route index element={<HomePage />} />

          <Route path="about" element={<AboutPage />} />
          <Route path="dining" element={<DiningPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="offers" element={<OffersPage />} />

          <Route path="privacyy" element={<Privacy />} />
          <Route path="terms-of-use" element={<TermsOfUse />} />

          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="verify-otp" element={<VerifyOtp />} />

          <Route path="menu" element={<Menu />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-success" element={<OrderSuccess />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        <Route path="admin" element={<AdminLoginPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
