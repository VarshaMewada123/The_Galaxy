import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { isValidEmail } from "@/utils/validators";
import { adminLogin, saveAdminSession } from "@/features/admin/admin.auth";

export default function AdminLogin() {
  const navigate = useNavigate();

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

    const data = await adminLogin({ email, password });

    // ✅ save token & admin info
    saveAdminSession(data);

    // ✅ REDIRECT TO DASHBOARD (PORT 3001)
    window.location.href = "http://localhost:3001/admin/dashboard";
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-screen flex items-center justify-center bg-[#FAF9F6] px-4">
      <motion.div className="bg-white p-10 max-w-[440px] w-full border">
        <h2 className="text-3xl text-center mb-8">Admin Sign In</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value.trim() })
            }
            className="w-full border-b py-2 outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border-b py-2 pr-10 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 bottom-2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-3 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          <Link to="/">Exit</Link>
        </p>
      </motion.div>
    </div>
  );
}
