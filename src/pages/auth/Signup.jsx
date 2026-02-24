import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { User, Phone, ArrowRight } from "lucide-react";
import { sendOtpApi } from "../../api/auth.api";

export default function Signup() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: state?.phone || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();

    const { fullName, phone } = formData;

    if (!fullName.trim() || phone.length < 10) {
      setError("Please fill in all details correctly");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await sendOtpApi({ fullName, phone });

      navigate("/verify-otp", {
        state: { phone },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C6A45C]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 md:p-12 w-full max-w-[450px] border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.03)]"
      >
        <div className="text-center mb-10">
          <motion.span
            {...fadeInUp}
            className="text-[#C6A45C] text-[10px] tracking-[0.4em] uppercase font-bold block mb-2"
          >
            Become a Member
          </motion.span>
          <motion.h2
            {...fadeInUp}
            className="text-3xl md:text-4xl font-serif text-[#1a1a1a]"
          >
            Create Account
          </motion.h2>
        </div>

        <form className="space-y-7" onSubmit={handleSignup}>
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              Full Name
            </label>
            <div className="flex items-center border-b border-gray-200 focus-within:border-[#C6A45C] transition-colors duration-300 py-2">
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full outline-none bg-transparent text-sm"
                autoFocus
              />
              <User size={16} className="text-gray-300" />
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              Phone Number
            </label>
            <div className="flex items-center border-b border-gray-200 focus-within:border-[#C6A45C] transition-colors duration-300 py-2">
              <span className="text-gray-400 mr-2 text-sm">+91</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="00000 00000"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setFormData({ ...formData, phone: val });
                }}
                className="w-full outline-none bg-transparent text-sm tracking-widest"
              />
              <Phone size={16} className="text-gray-300" />
            </div>
          </motion.div>

          {error && (
            <p className="text-red-500 text-[11px] text-center italic">
              {error}
            </p>
          )}

          <motion.button
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#C6A45C] text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase 
                       hover:bg-[#1a1a1a] transition-all duration-500 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                Continue{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-[12px]">
            Already have a membership?
            <Link to="/login" className="text-[#C6A45C] font-bold ml-2">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
