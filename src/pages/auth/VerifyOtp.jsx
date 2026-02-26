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

  const phone = state?.phone || "";

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: "easeOut" },
  };

  const handleVerify = async (e) => {
    e?.preventDefault();

    if (otp.length < 4) {
      setError("Please enter the full verification code");
      return;
    }

    if (!phone) {
      setError("Session expired. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await verifyOtpApi({
        phone,
        otp,
      });

      dispatch(
        loginSuccess({
          user: res.user,
          accessToken: res.token,
        }),
      );

      const redirectPath = state?.redirect || "/";

      navigate(redirectPath, {
        replace: true,
        state: {
          autoPlaceOrder: state?.autoPlaceOrder || false,
        },
      });
    } catch (err) {
      setError(
        err?.message || "The code you entered is invalid. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-4">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C6A45C]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="bg-white p-8 md:p-12 w-full max-w-md border border-gray-100 shadow-sm"
      >
        <div className="text-center mb-10">
          <motion.span
            {...fadeInUp}
            className="text-[#C6A45C] text-[10px] tracking-[0.4em] uppercase font-bold block mb-2"
          >
            Security Verification
          </motion.span>

          <motion.h2 {...fadeInUp} className="text-3xl md:text-4xl font-serif">
            Confirm Identity
          </motion.h2>

          <p className="text-gray-400 text-sm mt-3">
            We've sent a 6-digit code to
            <br />
            <span className="text-black font-medium">+91 {phone}</span>
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleVerify}>
          <motion.div {...fadeInUp}>
            <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">
              Verification Code
            </label>

            <div className="flex items-center border-b border-gray-200 focus-within:border-[#C6A45C] py-2 transition">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                placeholder="0 0 0 0 0 0"
                autoFocus
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, ""));
                  setError("");
                }}
                className="w-full text-center text-2xl tracking-[0.5em] outline-none bg-transparent"
              />

              <ShieldCheck size={20} className="text-gray-300" />
            </div>
          </motion.div>

          {error && (
            <p className="text-red-500 text-[11px] text-center italic">
              {error}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading || otp.length < 4}
            className="w-full bg-[#1a1a1a] text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {loading ? (
              "Verifying..."
            ) : (
              <>
                Continue
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-10 text-center">
          <button className="flex items-center justify-center gap-2 mx-auto text-gray-400 hover:text-[#C6A45C] transition">
            <RefreshCcw size={12} />
            <span className="text-[11px] uppercase tracking-widest font-bold">
              Resend Code
            </span>
          </button>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 block w-full text-gray-300 text-[10px] uppercase"
          >
            Entered wrong number? Edit phone
          </button>
        </div>
      </motion.div>
    </div>
  );
}
