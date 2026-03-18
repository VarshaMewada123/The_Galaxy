/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ChevronLeft,
  AlertCircle,
  MapPin,
  Phone,
  Clock,
  RefreshCcw,
} from "lucide-react";
import { toast } from "react-hot-toast";

import axiosClient from "@/api/axiosClient";
import OrderTimeline from "@/components/OrderTimeline";
import ReviewModal from "@/components/review/ReviewModal";

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" } 
  },
  exit: { opacity: 0, y: -10 }
};

export default function TrackOrder() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchOrder = useCallback(async (isSilent = false) => {
    if (!orderId) return;
    if (!isSilent) setLoading(true);

    try {
      const orderRes = await axiosClient.get(`/orders/${orderId}`);
      setOrder(orderRes.data.data);

      try {
        const reviewRes = await axiosClient.get(`/reviews/order/${orderId}`);
        setReviews(reviewRes.data.data || []);
      } catch (e) {
        setReviews([]);
      }

      setError(false);
    } catch (err) {
      setError(true);
      toast.error("Failed to update order status");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      toast.error("Invalid Order ID");
      navigate("/orders");
      return;
    }

    fetchOrder();
    const interval = setInterval(() => fetchOrder(true), 15000);
    return () => clearInterval(interval);
  }, [orderId, fetchOrder, navigate]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-[#C5A059]/30">
      {/* Sticky Navigation Bar with Back Button */}
 
      <div className="h-24" />

        <div className="mx-auto max-w-5xl px-4 h-16 sm:h-20 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-700 hover:text-[#C5A059] transition-all p-2 -ml-2 rounded-xl active:scale-95"
          >
            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 group-hover:border-[#C5A059]/30">
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </div>
            <span className="font-bold text-sm hidden sm:inline uppercase tracking-wider">Back</span>
          </button>

          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold text-green-700 uppercase tracking-wider">
              Live Tracking
            </span>
          </div>
        </div>
     

      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="space-y-6">
              <div className="w-full h-64 bg-gray-200 animate-pulse rounded-[2rem]" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-24 bg-gray-200 animate-pulse rounded-[1.5rem]" />
                <div className="h-24 bg-gray-200 animate-pulse rounded-[1.5rem]" />
              </div>
            </div>
          ) : error ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-[2.5rem] p-8 sm:p-12 text-center shadow-sm border border-gray-100"
            >
              <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-balance">Order Not Found</h2>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">Details update nahi ho paaye. Please refresh karein.</p>
              <button
                onClick={() => fetchOrder()}
                className="inline-flex items-center gap-2 bg-[#C5A059] hover:bg-[#b38f4d] text-white px-8 py-3 rounded-full font-bold transition-all transform active:scale-95 shadow-lg shadow-[#C5A059]/20"
              >
                <RefreshCcw className="w-4 h-4" />
                Retry Now
              </button>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Main Status Card */}
              <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute -top-6 -right-6 opacity-[0.03] pointer-events-none">
                  <Package size={200} />
                </div>

                <div className="relative z-10">
                  <p className="text-[#C5A059] font-bold text-xs sm:text-sm uppercase tracking-widest mb-3">
                    Order Status
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-8 leading-tight">
                    {order.status === "delivered"
                      ? "Enjoy your meal!"
                      : "Your order is being prepared"}
                  </h2>

                  <div className="py-4">
                    <OrderTimeline status={order.status} />
                  </div>

                  {order.status === "delivered" && reviews.length === 0 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowReview(true)}
                      className="mt-8 w-full sm:w-auto bg-[#C5A059] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-[#C5A059]/20 hover:bg-[#b38f4d] transition-colors"
                    >
                      Rate Your Order
                    </motion.button>
                  )}

                  {reviews.length > 0 && (
                    <div className="mt-8 bg-green-50/50 rounded-2xl border border-green-100 p-5">
                      <p className="font-bold text-green-800 text-sm mb-4">Your Reviews</p>
                      <div className="space-y-3">
                        {reviews.map((r) => (
                          <div key={r._id} className="bg-white/60 p-3 rounded-xl border border-green-100/50">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-bold text-gray-800">{r.menuItem?.name}</p>
                              <div className="flex text-yellow-500 text-xs">
                                {"★".repeat(r.rating)}
                              </div>
                            </div>
                            {r.comment && <p className="text-xs text-gray-600 mt-1">"{r.comment}"</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                    <MapPin className="text-[#C5A059] w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Delivery To</p>
                    <p className="font-bold text-gray-900 truncate">
                      {order.address?.street || "Room Service"}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Clock className="text-blue-600 w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Estimated Time</p>
                    <p className="font-bold text-gray-900">
                      {order.estimatedArrival || "25 - 30 mins"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Partner Card */}
              <div className="bg-gray-900 rounded-[2rem] p-5 sm:p-6 text-white shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-12 w-12 rounded-full bg-[#C5A059] flex items-center justify-center font-bold text-lg shrink-0 border-2 border-white/10">
                    {order.deliveryPartner?.name?.charAt(0) || "R"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-medium">Delivery Partner</p>
                    <p className="font-bold truncate">
                      {order.deliveryPartner?.name || "Ravi"}
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${order.deliveryPartner?.phone || "0000000000"}`}
                  className="bg-white/10 hover:bg-white text-white hover:text-black h-12 w-12 flex items-center justify-center rounded-full transition-all active:scale-90 shrink-0 border border-white/20"
                >
                  <Phone size={20} />
                </a>
              </div>

              <div className="text-center pt-4">
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-[0.2em]">
                  Order ID: <span className="font-bold text-gray-600">#{order.orderNumber}</span>
                </p>
              </div>

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
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}