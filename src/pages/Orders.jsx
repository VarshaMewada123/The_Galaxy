import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import axiosClient from "@/api/axiosClient";
import { motion } from "framer-motion";

export default function Orders() {
  const { accessToken } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get("/orders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-lg">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-serif font-bold mb-8 text-center"
        >
          Your Orders
        </motion.h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl text-gray-400">📦</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-8">Order something delicious!</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-[#1a1a1a] text-white px-8 py-3 text-sm font-bold tracking-[0.2em] uppercase hover:bg-[#C6A45C]"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-bold text-xl">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-[#C6A45C]">
                      ₹{order.pricing.total.toLocaleString()}
                    </span>
                    <p className="text-sm text-gray-500">
                      {order.status?.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Items:</span>{" "}
                    {order.items.length}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {order.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
