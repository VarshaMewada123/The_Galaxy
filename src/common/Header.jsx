import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VITE_ADMIN_APP_URL = import.meta.env.VITE_ADMIN_APP_URL;

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
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = AUTH_PATHS.includes(location.pathname);
  const shouldShowSolid = isScrolled || isAuthPage || isMobileMenuOpen;

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 70);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleAdminRedirect = () => {
    if (VITE_ADMIN_APP_URL) window.location.href = VITE_ADMIN_APP_URL;
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        shouldShowSolid ? "bg-white shadow-md py-4" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <Link
          to="/"
          className="text-2xl font-serif tracking-wide cursor-pointer hover:scale-105 transition-transform duration-200"
        >
          <span
            className={`${shouldShowSolid ? "text-black" : "text-white"} transition-colors duration-300`}
          >
            Hotel
          </span>
          <span className="text-[#C6A45C]"> The Galaxy</span>
        </Link>

        <ul
          className={`hidden md:flex gap-8 text-sm uppercase tracking-wider font-medium transition-colors duration-300 ${
            shouldShowSolid ? "text-gray-800" : "text-white"
          }`}
        >
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`transition-colors duration-200 ${
                    isActive ? "text-[#C6A45C]" : "hover:text-[#C6A45C]"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex gap-4 items-center">
          <Link
            to="/login"
            className={`hidden sm:block text-sm font-medium transition-colors ${
              location.pathname === "/login"
                ? "text-[#C6A45C]"
                : shouldShowSolid
                  ? "text-black"
                  : "text-white"
            } hover:text-[#C6A45C]`}
          >
            Login
          </Link>

          <button
            onClick={handleAdminRedirect}
            className={`px-5 py-2 rounded-sm text-sm font-bold tracking-wide transition-all duration-300 ${
              shouldShowSolid
                ? "bg-[#C6A45C] text-white hover:bg-black"
                : "bg-white text-black hover:bg-[#C6A45C] hover:text-white"
            }`}
          >
            Admin
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="text-black" size={28} />
            ) : (
              <Menu
                className={shouldShowSolid ? "text-black" : "text-white"}
                size={28}
              />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-0 left-0 w-full bg-white z-[-1] overflow-hidden flex flex-col pt-24 px-10 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-2xl font-serif ${
                    location.pathname === link.path
                      ? "text-[#C6A45C]"
                      : "text-black"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <hr />
              <Link
                to="/login"
                className={`text-lg uppercase tracking-widest ${
                  location.pathname === "/login"
                    ? "text-[#C6A45C]"
                    : "text-gray-600"
                }`}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
