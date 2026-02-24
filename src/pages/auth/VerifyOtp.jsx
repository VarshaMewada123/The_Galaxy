import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtpApi } from "../../api/auth.api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { ShieldCheck, ArrowRight, RefreshCcw } from "lucide-react";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const phone = state?.phone || "your number";

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();

    if (otp.length < 4) {
      setError("Please enter the full verification code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await verifyOtpApi({
        phone: state.phone,
        otp,
      });

      dispatch(loginSuccess(res.data));
      navigate("/order-success");
    } catch (err) {
      setError("The code you entered is invalid. Please try again.");
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
        className="bg-white p-8 md:p-12 w-full max-w-[450px] border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.03)] relative"
      >
        <div className="text-center mb-10">
          <motion.span
            {...fadeInUp}
            className="text-[#C6A45C] text-[10px] tracking-[0.4em] uppercase font-bold block mb-2"
          >
            Security Verification
          </motion.span>
          <motion.h2
            {...fadeInUp}
            className="text-3xl md:text-4xl font-serif text-[#1a1a1a]"
          >
            Confirm Identity
          </motion.h2>
          <p className="text-gray-400 text-sm mt-3 font-light leading-relaxed">
            We've sent a 6-digit code to <br />
            <span className="text-[#1a1a1a] font-medium">+91 {phone}</span>
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleVerify}>
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">
              Verification Code
            </label>
            <div className="flex items-center border-b border-gray-200 focus-within:border-[#C6A45C] transition-colors duration-300 py-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setOtp(val);
                  setError("");
                }}
                className="w-full outline-none bg-transparent text-2xl tracking-[0.5em] text-center font-light placeholder:text-gray-100"
                autoFocus
              />
              <ShieldCheck size={20} className="text-gray-300" />
            </div>
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-[11px] text-center italic"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            type="submit"
            disabled={loading || otp.length < 4}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#1a1a1a] text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase 
                       hover:bg-[#C6A45C] transition-all duration-500 disabled:opacity-40
                       flex items-center justify-center gap-2 group"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Access Dashboard{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <button
            type="button"
            className="flex items-center justify-center gap-2 mx-auto text-gray-400 hover:text-[#C6A45C] transition-colors duration-300"
          >
            <RefreshCcw size={12} />
            <span className="text-[11px] uppercase tracking-widest font-bold">
              Resend Code
            </span>
          </button>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 block w-full text-gray-300 text-[10px] uppercase tracking-tighter hover:text-gray-500 transition-all"
          >
            Entered wrong number? Edit phone
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-12 h-12 opacity-[0.03] pointer-events-none rotate-90">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 100H100V0" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
