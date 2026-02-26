import { useState, useEffect, useCallback, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_URL = import.meta.env.VITE_ADMIN_APP_URL;

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

const Header = memo(function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = AUTH_PATHS.includes(location.pathname);
  const shouldShowSolid = isScrolled || isAuthPage || isMobileMenuOpen;

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 70;
    setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
  }, [isMobileMenuOpen]);

  const handleAdminRedirect = () => {
    if (ADMIN_URL) window.location.href = ADMIN_URL;
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
        shouldShowSolid ? "bg-white shadow-md py-4" : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-2xl font-serif tracking-wide transition-transform duration-200 hover:scale-105"
        >
          <span
            className={`transition-colors duration-300 ${
              shouldShowSolid ? "text-black" : "text-white"
            }`}
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
            const active = location.pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`transition-colors duration-200 ${
                    active ? "text-[#C6A45C]" : "hover:text-[#C6A45C]"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
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
            className={`px-5 py-2 text-sm font-bold tracking-wide rounded-sm transition-all duration-300 ${
              shouldShowSolid
                ? "bg-[#C6A45C] text-white hover:bg-black"
                : "bg-white text-black hover:bg-[#C6A45C] hover:text-white"
            }`}
          >
            Admin
          </button>

          <button
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            className="md:hidden"
          >
            {isMobileMenuOpen ? (
              <X size={28} className="text-black" />
            ) : (
              <Menu
                size={28}
                className={shouldShowSolid ? "text-black" : "text-white"}
              />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-white pt-24 px-8 md:hidden overflow-y-auto"
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
});

export default Header;
