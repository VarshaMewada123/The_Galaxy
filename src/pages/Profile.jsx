import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/auth.store";
import axiosClient from "../api/axiosClient";
import { useSearchParams } from "react-router-dom";
import {
  Package,
  MapPin,
  CreditCard,
  Settings,
  User,
  Truck,
  RotateCcw,
  XCircle,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const initialTab = searchParams.get("tab") || "orders";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const [form, setForm] = useState({
    street: "",
    landmark: "",
    city: "",
    pincode: "",
    label: "Home",
  });

  const menuItems = [
    { id: "orders", label: "Orders", icon: <Package size={20} /> },
    { id: "addresses", label: "Addresses", icon: <MapPin size={20} /> },
    { id: "payments", label: "Payments", icon: <CreditCard size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const isAddressValid = useMemo(() => {
    const pinRegex = /^[1-9][0-9]{5}$/;
    return (
      form.street?.trim().length >= 3 &&
      form.landmark?.trim().length >= 3 &&
      form.city?.trim().length >= 2 &&
      pinRegex.test(form.pincode)
    );
  }, [form]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/orders");
      setOrders(res.data.data);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await axiosClient.get("/addresses");
      setAddresses(res.data.addresses);
    } catch (err) {
      toast.error("Failed to load addresses");
    }
  }, []);

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "addresses") fetchAddresses();
  }, [activeTab, fetchOrders, fetchAddresses]);

  const cancelOrder = async (id) => {
    try {
      await axiosClient.patch(`/orders/${id}/status`, { status: "cancelled" });
      toast.success("Order cancelled");
      fetchOrders();
    } catch (err) {
      toast.error("Could not cancel order");
    }
  };

  const orderAgain = async (order) => {
    const loadId = toast.loading("Placing order...");
    try {
      const payload = {
        items: order.items.map((item) => ({
          menuItem: item.menuItem._id || item.menuItem,
          quantity: item.quantity,
        })),
        address: order.address,
      };
      const res = await axiosClient.post("/orders", payload);
      if (res.data.success) {
        toast.success("Order placed successfully", { id: loadId });
        setActiveTab("orders");
        fetchOrders();
      }
    } catch (err) {
      toast.error("Failed to re-order", { id: loadId });
    }
  };

  const saveAddress = async () => {
    if (!isAddressValid) return;
    const loadId = toast.loading("Saving address...");
    try {
      let res;
      if (editingAddress) {
        res = await axiosClient.patch(`/addresses/${editingAddress}`, form);
        setAddresses((prev) =>
          prev.map((a) => (a._id === editingAddress ? res.data.address : a)),
        );
        toast.success("Address updated", { id: loadId });
      } else {
        res = await axiosClient.post("/addresses", form);
        setAddresses((prev) => [...prev, res.data.address]);
        toast.success("Address added", { id: loadId });
      }
      setShowAddressForm(false);
      setEditingAddress(null);
      setForm({
        street: "",
        landmark: "",
        city: "",
        pincode: "",
        label: "Home",
      });
    } catch (err) {
      toast.error("Failed to save address", { id: loadId });
    }
  };

  const deleteAddress = async (id) => {
    try {
      await axiosClient.delete(`/addresses/${id}`);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      const res = await axiosClient.patch(`/addresses/default/${id}`);
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a._id === res.data.address._id,
        })),
      );
      toast.success("Default address updated");
    } catch (err) {
      toast.error("Failed to set default");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] pt-18 pb-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-900">
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-[#C6A45C] rounded-t-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-3 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                <User size={40} className="text-white" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {user?.fullName || "Guest User"}
                </h1>

                <p className="text-white/80">{user?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-b-2xl flex flex-col lg:flex-row overflow-hidden min-h-[600px]">
          <nav className="w-full lg:w-72 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-100">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar p-2 lg:p-4 gap-1 lg:gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-center lg:justify-start gap-3 px-5 py-3.5 rounded-xl whitespace-nowrap transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-[#C6A45C] text-white shadow-md shadow-[#C5A059]/30 font-bold"
                      : "text-slate-500 hover:bg-[#C6A45C]/10 hover:text-[#C5A059]"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm md:text-base">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          <main className="flex-1 p-5 md:p-8 lg:p-10">
            {activeTab === "orders" && (
              <div className="space-y-6 max-w-4xl mx-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-medium">
                      Fetching your orders...
                    </p>
                  </div>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <motion.div
                      layout
                      key={order._id}
                      className="group border border-slate-100 rounded-2xl overflow-hidden hover:border-[#C5A059]/30 transition-all shadow-sm"
                    >
                      <div className="bg-slate-50/80 p-4 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                            Order ID
                          </span>
                          <span className="font-mono font-bold text-slate-700">
                            {order.orderNumber}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span
                            className={`px-3 py-1 text-[10px] uppercase tracking-tighter font-black rounded-full shadow-sm ${
                              order.status === "delivered"
                                ? "bg-emerald-100 text-emerald-700"
                                : order.status === "cancelled"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="text-xs text-slate-400 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 md:p-6 space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex justify-between items-center gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={item.menuItem?.images?.[0]?.url}
                                alt={item.name}
                                className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-100"
                              />
                              <div>
                                <h4 className="font-bold text-slate-800 line-clamp-1">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-slate-500 font-medium">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-slate-700 text-lg">
                              ₹{item.total}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 bg-white border-t border-slate-50 flex flex-wrap gap-3">
                        <button
                          onClick={() => navigate(`/track-order/${order._id}`)}
                          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C6A45C] text-white rounded-xl text-sm font-bold hover:bg-[#C6A45C]  transition-colors cursor-pointer "
                        >
                          <Truck size={16} /> Track
                        </button>
                        <button
                          onClick={() => orderAgain(order)}
                          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <RotateCcw size={16} /> Re-order
                        </button>
                        {order.status !== "delivered" &&
                          order.status !== "cancelled" && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 text-rose-600 border-2 border-rose-50 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <XCircle size={16} /> Cancel
                            </button>
                          )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Package
                      size={48}
                      className="mx-auto text-slate-300 mb-4"
                    />
                    <h3 className="text-lg font-bold text-slate-600">
                      No orders yet
                    </h3>
                    <p className="text-slate-400">
                      Your delicious journey starts here!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-8 max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">
                      Your Addresses
                    </h2>
                    <p className="text-slate-400 text-sm">
                      Manage your delivery locations
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setForm({
                        street: "",
                        landmark: "",
                        city: "",
                        pincode: "",
                        label: "Home",
                      });
                      setShowAddressForm(true);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#C5A059] text-white rounded-xl font-bold shadow-lg shadow-[#C5A059]/20 hover:scale-[1.02] transition-transform active:scale-95 cursor-pointer"
                  >
                    <Plus size={20} /> Add New
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {showAddressForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-slate-50 rounded-2xl p-6 border-2 border-[#C5A059]/20 space-y-5">
                        <h3 className="font-black text-slate-700 uppercase tracking-tight">
                          {editingAddress ? "Update Location" : "New Location"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            placeholder="Street / House No."
                            value={form.street}
                            onChange={(e) =>
                              setForm({ ...form, street: e.target.value })
                            }
                            className="w-full bg-white border border-slate-200 focus:ring-4 focus:ring-[#C5A059]/10 focus:border-[#C5A059] outline-none p-4 rounded-xl transition-all"
                          />
                          <input
                            placeholder="Landmark"
                            value={form.landmark}
                            onChange={(e) =>
                              setForm({ ...form, landmark: e.target.value })
                            }
                            className="w-full bg-white border border-slate-200 focus:ring-4 focus:ring-[#C5A059]/10 focus:border-[#C5A059] outline-none p-4 rounded-xl transition-all"
                          />
                          <input
                            placeholder="City"
                            value={form.city}
                            onChange={(e) =>
                              setForm({ ...form, city: e.target.value })
                            }
                            className="w-full bg-white border border-slate-200 focus:ring-4 focus:ring-[#C5A059]/10 focus:border-[#C5A059] outline-none p-4 rounded-xl transition-all"
                          />
                          <input
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="Pincode"
                            value={form.pincode}
                            onChange={(e) =>
                              setForm({
                                ...form,
                                pincode: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            className="w-full bg-white border border-slate-200 focus:ring-4 focus:ring-[#C5A059]/10 focus:border-[#C5A059] outline-none p-4 rounded-xl transition-all"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                          <select
                            value={form.label}
                            onChange={(e) =>
                              setForm({ ...form, label: e.target.value })
                            }
                            className="w-full sm:w-1/3 bg-white border border-slate-200 p-4 rounded-xl outline-none cursor-pointer"
                          >
                            <option>Home</option>
                            <option>Work</option>
                            <option>Other</option>
                          </select>
                          <div className="flex gap-3 w-full sm:w-auto ml-auto">
                            <button
                              onClick={() => setShowAddressForm(false)}
                              className="flex-1 px-6 py-4 font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveAddress}
                              disabled={!isAddressValid}
                              className={`flex-1 px-8 py-4 rounded-xl font-bold transition-all ${
                                isAddressValid
                                  ? "bg-slate-900 text-white shadow-xl"
                                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                              }`}
                            >
                              {editingAddress ? "Update" : "Save Address"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className={`relative group p-6 rounded-2xl border-2 transition-all ${
                        addr.isDefault
                          ? "border-[#C5A059] bg-[#C5A059]/5"
                          : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${addr.isDefault ? "bg-[#C5A059] text-white" : "bg-slate-100 text-slate-500"}`}
                          >
                            <MapPin size={18} />
                          </div>
                          <span className="font-black text-slate-800 text-lg uppercase tracking-tight">
                            {addr.label}
                          </span>
                        </div>
                        {addr.isDefault && (
                          <span className="text-[10px] font-black uppercase bg-[#C5A059] text-white px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {addr.street}, {addr.landmark} <br />
                        <span className="text-slate-400 font-bold">
                          {addr.city} - {addr.pincode}
                        </span>
                      </p>
                      <div className="mt-6 pt-4 border-t border-slate-100 flex gap-4 ">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr._id)}
                            className="text-xs font-bold text-[#C5A059] hover:underline cursor-pointer"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingAddress(addr._id);
                            setForm({ ...addr });
                            setShowAddressForm(true);
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAddress(addr._id)}
                          className="text-xs font-bold text-rose-400 hover:text-rose-600 ml-auto transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">
                    Payment Methods
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Choose how you want to pay for your orders
                  </p>
                </div>

                {/* COD OPTION */}
                <div className="border-2 border-[#C5A059] bg-[#C5A059]/5 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C5A059] flex items-center justify-center text-white">
                      ₹
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800">
                        Cash on Delivery
                      </h4>

                      <p className="text-sm text-slate-500">
                        Pay with cash when your order arrives
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold bg-[#C5A059] text-white px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>

                {/* ONLINE PAYMENT COMING SOON */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50">
                  <CreditCard
                    size={36}
                    className="mx-auto text-slate-300 mb-4"
                  />

                  <h3 className="text-lg font-bold text-slate-700">
                    Online Payments Coming Soon
                  </h3>

                  <p className="text-slate-400 text-sm max-w-sm mx-auto">
                    UPI, Cards and Wallet payments will be available very soon.
                  </p>

                  <div className="flex justify-center gap-4 mt-6 text-xs text-slate-400">
                    <span className="px-3 py-1 bg-white rounded-full border">
                      UPI
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full border">
                      Cards
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full border">
                      Wallets
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">
                    Account Settings
                  </h2>
                  <p className="text-slate-400 text-sm">
                    Manage your profile and preferences
                  </p>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      <User className="text-slate-500" size={22} />
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800">Edit Profile</h4>

                      <p className="text-sm text-slate-400">
                        Update your name and phone number
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="text-sm font-bold text-[#C5A059] hover:underline"
                  >
                    Edit
                  </button>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      🔔
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800">
                        Notifications
                      </h4>

                      <p className="text-sm text-slate-400">
                        Receive updates about your orders
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-[#C5A059]"
                    defaultChecked
                  />
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                      ❓
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800">
                        Help & Support
                      </h4>

                      <p className="text-sm text-slate-400">
                        Contact us if you need assistance
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/support")}
                    className="text-sm font-bold text-[#C5A059] hover:underline"
                  >
                    Open
                  </button>
                </div>

                <div className="bg-white border border-red-100 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                      <XCircle className="text-red-400" size={22} />
                    </div>

                    <div>
                      <h4 className="font-bold text-red-500">Logout</h4>

                      <p className="text-sm text-slate-400">
                        Sign out from your account
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      useAuthStore.getState().logout();
                      navigate("/");
                    }}
                    className="text-sm font-bold text-red-500 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </motion.div>
    </div>
  );
}
