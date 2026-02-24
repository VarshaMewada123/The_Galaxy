import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, CheckCircle, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state?.order;
  const message = state?.message || "Order placed successfully!";

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#F5F1E9] rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#F5F1E9] rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-white border border-[#F5F1E9] rounded-[2.5rem] p-8 md:p-12 text-center shadow-[0_20px_50px_rgba(198,164,92,0.1)] max-w-lg w-full"
      >
        <div className="w-20 h-20 md:w-24 md:h-24 bg-[#F5F1E9] rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
          <CheckCircle size={40} className="text-[#C6A45C]" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-3">
          Thank You!
        </h1>
        <p className="text-base md:text-lg text-gray-500 mb-6 font-light">
          {message}
        </p>

        {order ? (
          <div className="space-y-4 mb-8">
            <div className="inline-block px-4 py-1 rounded-full bg-[#F5F1E9] text-[#A68A4B] text-xs font-bold tracking-widest uppercase">
              Order Confirmed
            </div>
            <p className="text-2xl md:text-3xl font-serif font-bold text-[#C6A45C]">
              #{order.orderNumber}
            </p>

            <div className="bg-[#FAF9F6] border border-[#F5F1E9] p-5 md:p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 text-sm">Amount Paid</span>
                <span className="text-gray-900 font-semibold">
                  ₹{order.pricing.total.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-[#A68A4B] text-right italic font-light">
                Arriving in 30-45 mins
              </p>
            </div>
          </div>
        ) : (
          <div className="h-20" />
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-[#1a1a1a] text-white py-4 px-8 text-xs font-bold tracking-[0.2em] uppercase rounded-xl hover:bg-[#C6A45C] transition-all duration-300 shadow-xl flex items-center justify-center group"
          >
            View Orders
            <ArrowRight
              size={16}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-transparent text-gray-400 py-3 text-xs font-bold tracking-[0.1em] uppercase rounded-xl hover:text-[#C6A45C] transition-all"
          >
            Explore with Galaxy
          </button>
        </div>
      </motion.div>
    </div>
  );
}
