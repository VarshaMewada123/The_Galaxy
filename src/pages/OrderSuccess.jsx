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
    console.log("OrderSuccess orderId:", orderId);
    console.log("OrderSuccess orderNumber:", orderNumber);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={250}
          recycle={false}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-green-100 p-6 rounded-full">
            <CheckCircle2 size={60} className="text-green-600" />
          </div>
        </motion.div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Order Confirmed
        </h1>

        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
          Thank you for your order. Your delicious meal is now being prepared
          and will be delivered shortly.
        </p>
        {orderNumber && (
          <p className="mt-3 text-sm font-semibold text-[#C6A45C]">
            Order #{orderNumber}
          </p>
        )}
        <div className="bg-[#C6A45C]/5 border border-[#C6A45C]/20 rounded-xl p-4 mt-6">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
            Estimated Delivery
          </p>

          <p className="text-lg font-bold text-gray-900 mt-1">
            30 - 40 Minutes
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
            <MapPin size={14} />
            Live tracking available
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button onClick={() => navigate(`/track-order/${orderId}`)}>
            Track Order
          </button>
          <button
            onClick={() => navigate("/dining")}
            className="flex-1 border border-gray-200 py-4 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            Order More
          </button>
        </div>
      </motion.div>
    </div>
  );
}
