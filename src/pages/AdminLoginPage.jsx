import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { isValidEmail } from "@/utils/validators";

export default function AdminLogin() {
  const ADMIN_APP_URL = import.meta.env.VITE_ADMIN_APP_URL;

  if (!ADMIN_APP_URL) {
    throw new Error("VITE_ADMIN_APP_URL is not defined in environment variables");
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      return setError("All fields are required");
    }

    if (!isValidEmail(email)) {
      return setError("Enter a valid email address");
    }

    try {
      setLoading(true);
      setError("");

      // 🔐 Login request (cookie will be set by backend)
      await axiosClient.post("/admin/login", {
        email,
        password,
      });

      // 🚀 Redirect to admin dashboard app
      // 🚀 Redirect to admin dashboard app
        window.location.href = `${ADMIN_APP_URL}/admin/dashboard`;


    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#FAF9F6] px-4">
      <motion.div className="bg-white p-10 max-w-[440px] w-full border shadow-lg">
        <h2 className="text-3xl text-center mb-8 font-semibold">
          Admin Sign In
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Admin Email"
            value={formData.email}
            autoComplete="email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value.trim() })
            }
            className="w-full border-b py-2 outline-none focus:border-black"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              autoComplete="current-password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border-b py-2 pr-10 outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 bottom-2"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          <Link to="/" className="hover:underline">
            Exit
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
