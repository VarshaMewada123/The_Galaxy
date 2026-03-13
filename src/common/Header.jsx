/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, memo, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DoorOpenIcon, Menu, User, X, ChevronDown, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/auth.store";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Rooms", path: "/rooms" },
  { name: "Dining", path: "/dining" },
  { name: "Offers", path: "/offers" },
  { name: "About", path: "/about" },
];

const AUTH_PATHS = [
  "/login",
  "/signup",
  "/admin",
  "/privacyy",
  "/terms-of-use",
  "/checkout",
  "/contact",
  "/order-success",
  "/track-order",
  "/profile",
  "/verify-otp",
];

const Header = memo(function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);
  const logOut = useAuthStore((s) => s.logout);

  const isAuthPage = AUTH_PATHS.some((path) =>
    location.pathname.startsWith(path),
  );
  const shouldShowSolid = isScrolled || isAuthPage || isMobileMenuOpen;

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 50;
    setIsScrolled(scrolled);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutAction = () => {
    logOut();
    navigate("/");
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ease-in-out ${
        shouldShowSolid ? "bg-white shadow-lg py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="relative z-[110] text-xl md:text-2xl font-serif tracking-wide transition-transform hover:scale-105"
        >
          <span
            className={`transition-colors duration-300 ${shouldShowSolid ? "text-black" : "text-white"}`}
          >
            Hotel
          </span>
          <span className="text-[#C6A45C]"> The Galaxy</span>
        </Link>

        <ul
          className={`hidden md:flex items-center gap-8 text-xs lg:text-sm uppercase tracking-widest font-semibold transition-colors duration-300 ${
            shouldShowSolid ? "text-gray-800" : "text-white"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`transition-colors duration-200 hover:text-[#C6A45C] ${
                  location.pathname === link.path ? "text-[#C6A45C]" : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-4">
          {token ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 bg-[#C6A45C] text-white px-3 py-2 md:px-5 md:py-2.5 rounded-sm text-sm font-bold transition-transform active:scale-95 shadow-md cursor-pointer"
              >
                <User size={18} />
                <span className="hidden sm:inline capitalize">
                  {user?.fullName?.split(" ")[0]}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 shadow-xl rounded-md overflow-hidden z-50"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                    >
                      Profile
                    </Link>

                    <Link
                      to="/profile?tab=orders"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50"
                    >
                      Orders
                    </Link>

                    <Link
                      to="/profile?tab=addresses"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Addresses
                    </Link>
                    <button
                      onClick={handleLogoutAction}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 font-semibold hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-[#C6A45C] ${
                  shouldShowSolid ? "text-black" : "text-white"
                }`}
              >
                Login
              </Link>
              <button
                onClick={() => navigate("/admin")}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-tighter rounded-sm transition-all ${
                  shouldShowSolid
                    ? "bg-[#C6A45C] text-white hover:bg-black"
                    : "bg-white text-black hover:bg-[#C6A45C] hover:text-white"
                }`}
              >
                Admin
              </button>
            </div>
          )}
          <button
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`relative z-[110] p-2 md:hidden transition-colors ${
              isMobileMenuOpen || shouldShowSolid ? "text-black" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-[105] flex flex-col md:hidden"
          >
            <div className="flex flex-col h-full pt-28 px-8 pb-10">
              <div className="flex flex-col gap-6">
                {NAV_LINKS.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      className={`text-3xl font-serif ${
                        location.pathname === link.path
                          ? "text-[#C6A45C]"
                          : "text-black"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto border-t border-gray-100 pt-8">
                {token ? (
                  <button
                    onClick={handleLogoutAction}
                    className="flex items-center gap-3 text-xl uppercase tracking-widest text-red-600 font-bold"
                  >
                    <DoorOpenIcon /> Logout
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link
                      to="/login"
                      className="text-xl uppercase tracking-widest font-bold text-black"
                    >
                      Login
                    </Link>
                    <button
                      onClick={() => navigate("/admin")}
                      className="w-full py-4 bg-[#C6A45C] text-white font-bold uppercase tracking-widest"
                    >
                      Admin Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

export default Header;
