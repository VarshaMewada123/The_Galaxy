import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, MapPin } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const orderNumber = location.state?.orderNumber;

  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    /* 1. Flex-1 aur h-full use kiya hai taaki header ke niche bachi hui space le.
      2. py-4 add kiya hai taaki mobile par screen se chipke nahi.
    */
    <div className="flex-1 flex items-center justify-center bg-[#FAFAFA] px-4 py-20 overflow-hidden relative min-h-[85vh]">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={120}
          recycle={false}
          colors={["#C6A45C", "#E5D1A4", "#F5F5F5"]}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        // Padding p-5 aur max-width tight kar di hai
        className="max-w-[360px] w-full bg-white rounded-[2rem] shadow-sm border border-[#C6A45C]/10 p-5 sm:p-7 text-center"
      >
        {/* Success Icon - Size reduced */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex justify-center mb-3"
        >
          <div className="bg-[#C6A45C]/10 p-3 rounded-full">
            <CheckCircle2 size={36} className="text-[#C6A45C]" />
          </div>
        </motion.div>

        <h1 className="text-xl font-serif font-bold text-gray-800">
          Order Confirmed
        </h1>

        <p className="text-gray-500 mt-1.5 text-[13px] leading-tight px-4">
          Thank you! Your delicious meal is being prepared.
        </p>

        {orderNumber && (
          <div className="inline-block mt-2 px-3 py-0.5 bg-[#FDFBF7] border border-[#C6A45C]/20 rounded-full">
            <p className="text-[10px] font-bold text-[#C6A45C] uppercase tracking-wider">
              Order #{orderNumber}
            </p>
          </div>
        )}

        {/* Delivery Box - More compact */}
        <div className="bg-[#FAF9F6] border border-[#C6A45C]/10 rounded-2xl p-3 mt-5">
          <p className="text-[9px] uppercase tracking-[0.15em] text-[#C6A45C] font-bold">
            Estimated Delivery
          </p>

          <p className="text-base font-bold text-gray-800 mt-0.5">
            30 - 40 Minutes
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 mt-1">
            <MapPin size={10} className="text-[#C6A45C]/60" />
            Live tracking available
          </div>
        </div>

        {/* Buttons - Gap kam kar diya (gap-2) aur padding tight ki */}
        <div className="flex flex-col gap-2 mt-6">
          <button
            onClick={() => navigate(`/track-order/${orderId}`)}
            className="w-full bg-[#C6A45C] hover:bg-[#b39352] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md shadow-[#C6A45C]/10 cursor-pointer active:scale-95"
          >
            Track Order
          </button>
          
          <button
            onClick={() => navigate("/dining")}
            className="w-full bg-white border border-[#C6A45C]/20 py-3 rounded-xl font-bold text-sm text-gray-600 hover:bg-[#FAF9F6] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <ShoppingBag size={14} className="text-[#C6A45C]" />
            Order More
          </button>
        </div>
      </motion.div>
    </div>
  );
}