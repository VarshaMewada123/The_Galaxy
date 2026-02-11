import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { isValidEmail } from "../utils/validators";
import { isValidPhone } from "../utils/validators";

/* ================= component ================= */

export default function Login() {
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  /* ================= handlers ================= */

  const handleMethodChange = (method) => {
    setLoginMethod(method);
    setFormData({ identifier: "", password: "" });
    setError("");
  };

  const handleChange = (e) => {
    let value = e.target.value;

    if (loginMethod === "email") value = value.toLowerCase().trim();
    if (loginMethod === "phone") value = value.replace(/[^0-9]/g, "");

    setFormData((prev) => ({ ...prev, identifier: value }));
    setError("");
  };

  const handlePasswordChange = (e) => {
    setFormData((prev) => ({ ...prev, password: e.target.value }));
    setError("");
  };

  const handleLogin = async () => {
    const { identifier, password } = formData;

    if (!identifier || !password) {
      setError("All fields are required");
      return;
    }

    if (loginMethod === "email" && !isValidEmail(identifier)) {
      setError("Enter a valid email address");
      return;
    }

    if (loginMethod === "phone" && !isValidPhone(identifier)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { identifier, password },
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Server error. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#FAF9F6] px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#C6A45C]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm border border-gray-100 p-6 md:p-10 w-full max-w-[440px]"
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <motion.span className="text-[#C6A45C] uppercase tracking-[0.3em] text-[9px] font-bold">
            The Rivora Experience
          </motion.span>
          <motion.h2 className="text-3xl font-serif mt-2">
            Welcome Back
          </motion.h2>
        </div>

        {/* Method Switch */}
        <div className="flex mb-6 bg-gray-50 p-1">
          {["email", "phone"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => handleMethodChange(method)}
              className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase ${
                loginMethod === method
                  ? "bg-white shadow-sm text-[#C6A45C]"
                  : "text-gray-400"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            placeholder={
              loginMethod === "email"
                ? "luxury@example.com"
                : "Enter 10 digit number"
            }
            value={formData.identifier}
            onChange={handleChange}
            className="w-full border-b py-2 outline-none"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handlePasswordChange}
              className="w-full border-b py-2 pr-10 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-2 top-2 text-gray-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-[11px] text-center">{error}</p>
          )}

          <button
            disabled={loading}
            className="w-full bg-black text-white py-4 text-[10px] font-bold tracking-widest uppercase disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-[12px]">
            Don't have an account?
            <Link to="/signup" className="text-[#C6A45C] font-bold ml-1">
              Create membership
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
