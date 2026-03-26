import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  AlertCircle,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  ShoppingBag,
  UtensilsCrossed,
  Bike,
  PartyPopper,
  ClipboardCheck,
} from "lucide-react";
import axiosClient from "@/api/axiosClient";
import ReviewModal from "@/components/review/ReviewModal";

const ORDER_STATUS_STEPS = [
  {
    key: "pending",
    label: "Order Placed",
    sub: "We've received your order",
    Icon: ShoppingBag,
  },
  {
    key: "confirmed",
    label: "Restaurant Confirmed",
    sub: "Restaurant accepted your order",
    Icon: ClipboardCheck,
  },
  {
    key: "preparing",
    label: "Preparing Food",
    sub: "Chef is cooking your meal",
    Icon: UtensilsCrossed,
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    sub: "Your order is on the way",
    Icon: Bike,
  },
  {
    key: "delivered",
    label: "Delivered",
    sub: "Enjoy your meal!",
    Icon: PartyPopper,
  },
];

export default function TrackOrder() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [partnerLocation, setPartnerLocation] = useState(null);
  const [eta, setEta] = useState(null);

  const getActiveStepIndex = (status) =>
    ORDER_STATUS_STEPS.findIndex((s) => s.key === status);

  const fetchOrder = useCallback(
    async (isSilent = false) => {
      if (!orderId) return;
      if (!isSilent) setLoading(true);

      try {
        const orderRes = await axiosClient.get(`/orders/${orderId}`);
        const data = orderRes.data.data;

        setOrder(data);

        if (data.deliveryPartnerLocation) {
          setPartnerLocation(data.deliveryPartnerLocation);
        }

        if (data.eta !== undefined && data.eta !== null) {
          setEta(data.eta);
        }

        try {
          const reviewRes = await axiosClient.get(`/reviews/order/${orderId}`);
          setReviews(reviewRes.data.data || []);
        } catch {
          setReviews([]);
        }

        setError(false);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [orderId],
  );

  useEffect(() => {
    if (!orderId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3,
      timeout: 5000,
      forceNew: true,
    });

    socket.on("connect", () => {
      socket.emit("join_order_room", orderId);
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("order_update", (data) => {
      console.log("📦 Order Update:", data);

      // ✅ ETA update (0 bhi allow)
      if (data?.eta !== undefined) {
        setEta(data.eta);
      }

      // ✅ Rider location update
      if (data?.partnerLocation) {
        setPartnerLocation({
          lat: Number(data.partnerLocation.lat),
          lng: Number(data.partnerLocation.lng),
        });
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => socket.disconnect();
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      navigate(-1);
      return;
    }
    fetchOrder();
    const interval = setInterval(() => fetchOrder(true), 10000);
    return () => clearInterval(interval);
  }, [orderId, fetchOrder, navigate]);

  const activeIndex = order ? getActiveStepIndex(order.status) : -1;

  return (
    <div
      className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <header className="bg-white sticky top-0 z-50 border-b border-[#C6A45C]/10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FDFBF7] border border-[#C6A45C]/20 active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
          </button>
          <div className="flex-1">
            <h1 className="text-[15px] font-black text-[#1A1A1A] leading-none">
              Track Order
            </h1>
            {order && (
              <p className="text-[11px] text-[#C6A45C] font-semibold mt-0.5">
                #{order.orderNumber}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">
              Live
            </span>
          </div>
        </div>
      </header>

      <main className="pb-10">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-3"
            >
              <div className="h-28 bg-gray-100 animate-pulse rounded-2xl" />
              <div className="h-80 bg-gray-100 animate-pulse rounded-2xl" />
              <div className="h-20 bg-gray-100 animate-pulse rounded-2xl" />
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[65vh] px-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-[17px] font-black mb-1">
                Couldn't load order
              </h2>
              <p className="text-[13px] text-gray-400 mb-6">
                We ran into an issue fetching your order details.
              </p>
              <button
                onClick={() => fetchOrder()}
                className="px-8 py-3 rounded-xl font-black text-[14px] text-white bg-[#C6A45C] shadow-lg shadow-[#C6A45C]/20 active:scale-95 transition-transform"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {order && !loading && !error && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 p-4"
            >
              {/* Status Banner */}
              <div className="bg-[#1A1A1A] rounded-2xl px-5 py-5 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#C6A45C]/10 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#C6A45C]/5 blur-xl" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-[#C6A45C]/15 border border-[#C6A45C]/20 px-2.5 py-1 rounded-full mb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C6A45C] animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C6A45C]">
                      {order.status === "delivered"
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>
                  <h2 className="text-[20px] font-black text-white leading-snug">
                    {order.status === "delivered"
                      ? "Delivered & Fresh! 🎉"
                      : ORDER_STATUS_STEPS[activeIndex]?.label}
                  </h2>
                  <p className="text-[12px] text-gray-400 mt-1">
                    {ORDER_STATUS_STEPS[activeIndex]?.sub}
                  </p>
                  <div className="mt-4 inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 rounded-lg">
                    <span className="text-[10px] font-mono text-gray-500">
                      ORDER · #{order.orderNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl px-5 py-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C6A45C] mb-5">
                  Order Progress
                </p>
                <div>
                  {ORDER_STATUS_STEPS.map((step, index) => {
                    const isDone = index < activeIndex;
                    const isCurrent = index === activeIndex;
                    const isPending = index > activeIndex;
                    const isLast = index === ORDER_STATUS_STEPS.length - 1;
                    const { Icon } = step;

                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500
                            ${isDone ? "bg-[#C6A45C]" : ""}
                            ${isCurrent ? "bg-[#1A1A1A]" : ""}
                            ${
                              isPending
                                ? "bg-gray-100 border border-gray-200"
                                : ""
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 transition-all duration-500
                              ${isDone ? "text-white" : ""}
                              ${isCurrent ? "text-[#C6A45C]" : ""}
                              ${isPending ? "text-gray-300" : ""}`}
                            />
                          </div>

                          {!isLast && (
                            <div
                              className="relative w-[2px] my-1 bg-gray-100 overflow-hidden"
                              style={{ height: 44 }}
                            >
                              {isDone && (
                                <div className="absolute inset-0 bg-[#C6A45C]" />
                              )}
                              {isCurrent && (
                                <motion.div
                                  className="absolute top-0 left-0 right-0 bg-[#C6A45C]"
                                  initial={{ height: "0%" }}
                                  animate={{ height: "100%" }}
                                  transition={{
                                    duration: 1.8,
                                    ease: "easeInOut",
                                  }}
                                />
                              )}
                            </div>
                          )}
                        </div>

                        <div className={`pt-2 ${!isLast ? "pb-10" : "pb-1"}`}>
                          <p
                            className={`text-[14px] font-bold leading-tight transition-colors duration-300
                            ${isDone ? "text-[#C6A45C]" : ""}
                            ${isCurrent ? "text-[#1A1A1A]" : ""}
                            ${isPending ? "text-gray-300" : ""}`}
                          >
                            {step.label}
                          </p>
                          {isCurrent && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-[11px] text-gray-400 mt-0.5"
                            >
                              {step.sub}
                            </motion.p>
                          )}
                          {isDone && (
                            <p className="text-[10px] text-[#C6A45C]/70 font-semibold mt-0.5 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Done
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {order.status === "delivered" && reviews.length === 0 && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowReview(true)}
                    className="w-full mt-4 py-4 rounded-xl font-black text-white text-[14px] bg-[#1A1A1A] shadow-xl active:scale-95 transition-transform"
                  >
                    Rate Your Experience ⭐
                  </motion.button>
                )}
              </div>

              {/* Delivery Partner */}
              <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between border border-[#C6A45C]/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] flex items-center justify-center font-black text-lg text-[#C6A45C]">
                    {order.deliveryPartner?.name?.charAt(0).toUpperCase() ||
                      "D"}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Your Delivery Hero
                    </p>
                    <p className="text-[15px] font-black text-[#1A1A1A]">
                      {order.deliveryPartner?.name || "Assigning..."}
                    </p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={`text-[11px] ${
                            s <= 4 ? "text-[#C6A45C]" : "text-gray-200"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.a
                  whileTap={{ scale: 0.9 }}
                  href={`tel:${order.deliveryPartner?.phone || "#"}`}
                  className="w-11 h-11 rounded-full border-2 border-[#C6A45C] flex items-center justify-center active:bg-[#C6A45C] group transition-all"
                >
                  <Phone className="w-4 h-4 text-[#C6A45C] group-active:text-white" />
                </motion.a>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl px-4 py-4 border border-[#C6A45C]/10">
                  <div className="w-9 h-9 rounded-xl bg-[#FDFBF7] border border-[#C6A45C]/15 flex items-center justify-center mb-3">
                    <MapPin className="w-4 h-4 text-[#C6A45C]" />
                  </div>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">
                    Drop-off
                  </p>
                  <p className="text-[12px] font-bold text-[#1A1A1A] leading-snug line-clamp-2">
                    {order.address?.street || "Lobby / Front Desk"}
                  </p>
                </div>

                <div className="bg-white rounded-2xl px-4 py-4 border border-[#C6A45C]/10">
                  <div className="w-9 h-9 rounded-xl bg-[#FDFBF7] border border-[#C6A45C]/15 flex items-center justify-center mb-3">
                    <Clock className="w-4 h-4 text-[#C6A45C]" />
                  </div>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">
                    Estimate
                  </p>
                  <p className="text-[12px] font-bold text-[#1A1A1A] leading-snug">
                    {eta !== null && eta !== undefined
                      ? `🕒 ${eta} mins`
                      : order?.eta > 0
                      ? `🕒 ${order.eta} mins`
                      : "⏳ Calculating ETA..."}
                  </p>
                  {partnerLocation && (
                    <p className="text-[10px] text-green-600 mt-1 font-semibold">
                      🚴 Rider is moving to your location
                    </p>
                  )}
                </div>
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
