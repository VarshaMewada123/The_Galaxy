import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Calendar,
  ChevronLeft,
  AlertCircle,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";
import axiosClient from "@/api/axiosClient";
import OrderTimeline from "@/components/OrderTimeline";

export default function TrackOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await axiosClient.get(`/orders/${orderId}`);
      setOrder(res.data.data);
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) {
      navigate("/orders");
      return;
    }
    fetchOrder();
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [orderId, fetchOrder, navigate]);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="h-24" />

      <div className="mx-auto max-w-2xl px-4 flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#C6A45C] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[11px] font-bold text-green-700 uppercase tracking-wider">
            Live Tracking
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 pb-12">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 animate-pulse rounded-[2rem]" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
                <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
              </div>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100"
            >
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-800">
                Order details not found
              </h2>
              <p className="text-gray-500 mt-2 mb-6">
                Maafi chahte hain, hum aapka order fetch nahi kar paaye.
              </p>
              <button
                onClick={fetchOrder}
                className="bg-[#C6A45C] text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Package size={120} />
                </div>

                <div className="relative z-10">
                  <p className="text-[#C6A45C] font-bold text-sm uppercase tracking-widest mb-2">
                    Order Status
                  </p>
                  <h2 className="text-3xl font-serif text-gray-900 mb-6">
                    {order.status === "delivered"
                      ? "Enjoy your meal!"
                      : "Your order is being prepared"}
                  </h2>

                  <div className="py-4">
                    <OrderTimeline status={order.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#C6A45C]/10 p-3 rounded-xl text-[#C6A45C]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Delivery To
                      </p>
                      <p className="font-bold text-gray-800 text-sm">
                        {order.address?.street || "Room Service / Table"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Estimated Time
                      </p>
                      <p className="font-bold text-gray-800 text-sm">
                        {order.estimatedArrival || "25 - 30 Mins"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-[2rem] p-6 text-white flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#C6A45C] flex items-center justify-center font-bold text-xl">
                    {order.deliveryPartner?.name?.charAt(0) || "R"}
                  </div>
                  <div>
                    <p className="font-bold">Delivery Partner</p>
                    <p className="text-xs text-gray-400">
                      {order.deliveryPartner?.name || "Ravi"} is assigning your
                      order
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:${order.deliveryPartner?.phone || "0000000000"}`}
                  className="bg-white text-black h-12 w-12 flex items-center justify-center rounded-full hover:bg-[#C6A45C] hover:text-white transition-all"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Order ID:{" "}
                  <span className="font-mono font-bold text-gray-800">
                    #{order.orderNumber}
                  </span>
                </p>
                <button className="mt-4 text-[#C6A45C] font-bold text-sm underline underline-offset-4">
                  Need Help with this order?
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
