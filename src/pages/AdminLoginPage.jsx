import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axiosClient from "@/api/axiosClient";
import { isValidEmail } from "@/utils/validators";

export default function AdminLogin() {
  const ADMIN_APP_URL = import.meta.env.VITE_ADMIN_APP_URL;

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid admin email");
      return;
    }

    try {
      setLoading(true);
      if (!ADMIN_APP_URL) {
        throw new Error("Admin configuration missing");
      }

      await axiosClient.post("/admin/login", { email, password });

      toast.success("Authentication successful!");

      setTimeout(() => {
        window.location.href = `${ADMIN_APP_URL}/admin/dashboard`;
      }, 1000);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] px-4 relative overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C5A059]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 w-full max-w-[460px] relative"
      >
        <div className="text-center mb-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] font-bold block mb-3"
          >
            Control Panel
          </motion.span>

          <h2 className="text-3xl md:text-4xl font-serif text-[#1a1a1a]">
            Admin Portal
          </h2>

          <p className="text-gray-400 text-sm mt-3 font-light">
            Secure access for authorized personnel only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-7">
          <div className="relative group">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 block">
              Administrative Email
            </label>
            <div className="flex items-center border-b border-gray-200 group-focus-within:border-[#C5A059] transition-colors duration-300">
              <input
                type="email"
                placeholder="admin@hotelthegalaxy.com"
                value={formData.email}
                autoComplete="email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value.trim() })
                }
                className="w-full py-3 outline-none text-base bg-transparent placeholder:text-gray-200"
              />
              <Mail
                size={16}
                className="text-gray-300 group-focus-within:text-[#C5A059] transition-colors"
              />
            </div>
          </div>

          <div className="relative group">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 block">
              Access Password
            </label>
            <div className="flex items-center border-b border-gray-200 group-focus-within:border-[#C5A059] transition-colors duration-300">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                autoComplete="current-password"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full py-3 outline-none text-base bg-transparent tracking-widest placeholder:tracking-normal placeholder:text-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-300 hover:text-[#C5A059] transition-colors px-2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <Lock
                size={16}
                className="text-gray-300 group-focus-within:text-[#C5A059] transition-colors"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#C5A059] text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase disabled:opacity-40 flex items-center justify-center gap-2 group transition-all hover:bg-[#b38f4d] shadow-sm"
          >
            {loading ? (
              "Verifying Credentials..."
            ) : (
              <>
                Authorize Access
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="text-gray-400 text-[11px] uppercase tracking-widest font-medium hover:text-[#C5A059] transition-colors flex items-center justify-center gap-1"
          >
            Return to Homepage
          </Link>
        </div>

        <div className="absolute bottom-0 right-0 w-16 h-16 opacity-[0.03] pointer-events-none">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            <path d="M0 100H100V0" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
