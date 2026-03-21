/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  AlertCircle,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Circle,
  ArrowLeft
} from "lucide-react";
import axiosClient from "@/api/axiosClient";
import ReviewModal from "@/components/review/ReviewModal";

const ORDER_STATUS_STEPS = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Restaurant Confirmed" },
  { key: "preparing", label: "Preparing Food" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function TrackOrder() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getActiveStepIndex = (currentStatus) => {
    return ORDER_STATUS_STEPS.findIndex(step => step.key === currentStatus);
  };

  const fetchOrder = useCallback(async (isSilent = false) => {
    if (!orderId) return;
    if (!isSilent) setLoading(true);
    try {
      const orderRes = await axiosClient.get(`/orders/${orderId}`);
      setOrder(orderRes.data.data);
      try {
        const reviewRes = await axiosClient.get(`/reviews/order/${orderId}`);
        setReviews(reviewRes.data.data || []);
      } catch (e) { setReviews([]); }
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) { navigate(-1); return; }
    fetchOrder();
    const interval = setInterval(() => fetchOrder(true), 10000);
    return () => clearInterval(interval);
  }, [orderId, fetchOrder, navigate]);

  return (
    <div className="h-screen bg-[#FDFBF7] text-[#1A1A1A] overflow-hidden flex flex-col font-sans">
      
      {/* --- Updated Premium Header --- */}
      <header className="px-4 py-3 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#C6A45C]/5">
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#FDFBF7] border border-[#C6A45C]/10 text-[#1A1A1A] transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-[#C6A45C]" />
          <span className="font-bold text-[11px] uppercase tracking-[0.15em]">Back</span>
        </motion.button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100/50 shadow-inner">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">Live Track</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8 scrollbar-hide">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="space-y-4 pt-6">
              <div className="h-32 bg-gray-200/50 animate-pulse rounded-[2.5rem]" />
              <div className="h-72 bg-gray-200/50 animate-pulse rounded-[2.5rem]" />
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <p className="font-bold text-lg">Order tracking unavailable</p>
              <p className="text-sm text-gray-500 mb-6">We couldn't find the details for this order ID.</p>
              <button 
                onClick={() => fetchOrder()} 
                className="bg-[#C6A45C] text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-[#C6A45C]/20"
              >
                Try Again
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5 pt-4"
            >
              {/* Order Status Card */}
              <div className="bg-white rounded-[2.5rem] p-7 border border-[#C6A45C]/10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6A45C]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <p className="text-[#C6A45C] font-black text-[10px] uppercase tracking-[0.2em] mb-2">Order Progress</p>
                <h2 className="text-2xl font-serif font-medium leading-tight text-[#1A1A1A]">
                  {order.status === "delivered" ? "Delivered & Fresh!" : "Your food is on the way"}
                </h2>
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[10px] font-mono text-gray-400">ORDER ID: #{order.orderNumber}</span>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="bg-white rounded-[2.5rem] p-7 border border-[#C6A45C]/10 shadow-sm">
                <div className="space-y-1">
                  {ORDER_STATUS_STEPS.map((step, index) => {
                    const isActive = index <= getActiveStepIndex(order.status);
                    const isCurrent = index === getActiveStepIndex(order.status);
                    const isLast = index === ORDER_STATUS_STEPS.length - 1;

                    return (
                      <div key={step.key} className="relative flex gap-5">
                        <div className="flex flex-col items-center">
                          <div className={`relative z-10 w-6 h-6 flex items-center justify-center rounded-full transition-all duration-500 
                            ${isActive ? "bg-[#C6A45C] text-white shadow-md shadow-[#C6A45C]/30" : "bg-gray-100 text-gray-300 border border-gray-200"}`}>
                            {isActive ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 fill-current" />}
                          </div>
                          {!isLast && (
                            <div className={`w-[2px] h-12 transition-colors duration-500 
                              ${index < getActiveStepIndex(order.status) ? "bg-[#C6A45C]" : "bg-gray-100"}`} 
                            />
                          )}
                        </div>

                        <div className="pt-0.5 pb-8">
                          <p className={`text-[13px] font-bold tracking-tight transition-colors duration-300
                            ${isActive ? "text-[#1A1A1A]" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                          {isCurrent && order.status !== "delivered" && (
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-[10px] text-[#C6A45C] font-bold uppercase tracking-wider block mt-1"
                            >
                              Current Stage
                            </motion.span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {order.status === "delivered" && reviews.length === 0 && (
                  <button
                    onClick={() => setShowReview(true)}
                    className="w-full bg-[#1A1A1A] text-white py-4 rounded-[1.5rem] font-bold text-sm shadow-xl active:scale-95 transition-transform"
                  >
                    Rate Your Experience
                  </button>
                )}
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[2rem] border border-[#C6A45C]/10">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDFBF7] flex items-center justify-center mb-3 border border-[#C6A45C]/10">
                    <MapPin className="text-[#C6A45C] w-5 h-5" />
                  </div>
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Drop-off</p>
                  <p className="font-bold text-[11px] leading-tight line-clamp-2">{order.address?.street || "Lobby / Front Desk"}</p>
                </div>

                <div className="bg-white p-5 rounded-[2rem] border border-[#C6A45C]/10">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDFBF7] flex items-center justify-center mb-3 border border-[#C6A45C]/10">
                    <Clock className="text-[#C6A45C] w-5 h-5" />
                  </div>
                  <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">Estimate</p>
                  <p className="font-bold text-[11px] leading-tight">{order.estimatedArrival || "15 - 20 mins"}</p>
                </div>
              </div>

              {/* Delivery Partner */}
              <div className="bg-[#1A1A1A] rounded-[2rem] p-5 text-white flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#C6A45C] flex items-center justify-center font-bold text-lg shadow-lg">
                    {order.deliveryPartner?.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.1em]">Your Delivery Hero</p>
                    <p className="font-bold text-sm">{order.deliveryPartner?.name || "Assigning..."}</p>
                  </div>
                </div>
                <motion.a
                  whileTap={{ scale: 0.9 }}
                  href={`tel:${order.deliveryPartner?.phone || "#"}`}
                  className="bg-white/10 hover:bg-[#C6A45C] h-12 w-12 flex items-center justify-center rounded-2xl transition-colors group"
                >
                  <Phone size={18} className="text-white" />
                </motion.a>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {showReview && (
        <ReviewModal
          order={order}
          orderId={order._id}
          onClose={() => {
            setShowReview(false);
            fetchOrder(true);
          }}
        />
      )}
    </div>
  );
}