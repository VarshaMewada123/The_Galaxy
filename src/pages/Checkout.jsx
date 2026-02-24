import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "@/api/axiosClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Trash2,
  CreditCard,
  MapPin,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";
import { State, City } from "country-state-city";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { items, removeItem, increaseQty, decreaseQty, clearCart } =
    useCartStore();
  const { user, accessToken } = useAuthStore();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    stateCode: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  useEffect(() => {
    const allStates = State.getStatesOfCountry("IN");
    setStates(allStates);
  }, []);

  useEffect(() => {
    if (address.stateCode) {
      const allCities = City.getCitiesOfState("IN", address.stateCode);
      setCities(allCities);
    } else {
      setCities([]);
    }
  }, [address.stateCode]);

  // Show error from login fallback
  useEffect(() => {
    if (location.state?.error) {
      alert(location.state.error);
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.error]);

  const handleChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStateChange = (e) => {
    const selected = states.find((s) => s.isoCode === e.target.value);
    setAddress((prev) => ({
      ...prev,
      state: selected?.name || "",
      stateCode: selected?.isoCode || "",
      city: "",
    }));
  };

  const handleCityChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.basePrice * item.qty,
    0,
  );
  const taxes = subtotal * 0.05;
  const total = subtotal + taxes;

  const validateAddress = () => {
    const nameRegex = /^[A-Za-z\s]{2,60}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;

    if (!nameRegex.test(address.fullName.trim()))
      return "Enter valid full name";
    if (!phoneRegex.test(address.phone))
      return "Enter valid Indian mobile number";
    if (!address.street.trim() || address.street.length < 5)
      return "Enter valid street address";
    if (!address.state) return "Select state";
    if (!address.city) return "Select city";
    if (!pincodeRegex.test(address.pincode))
      return "Enter valid Indian pincode";

    return null;
  };

  const handleCheckout = async () => {
    if (!accessToken || !user) {
      const error = validateAddress();
      if (error) {
        alert(error);
        return;
      }

      navigate("/login", {
        state: {
          redirect: "/checkout",
          autoPlaceOrder: true,
          cartData: {
            items: items.map((i) => ({
              product: i._id,
              qty: i.qty,
              price: i.basePrice,
            })),
            address,
            pricing: { subtotal, taxes, total },
          },
        },
      });
      return;
    }
    const error = validateAddress();
    if (error) {
      alert(error);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        items: items.map((i) => ({
          product: i._id,
          qty: i.qty,
          price: i.basePrice,
        })),
        address,
        pricing: { subtotal, taxes, total },
      };

      const res = await axiosClient.post("/orders", payload);

      clearCart();
      setSuccessOrder(res.data.data);
      setShowSuccess(true);
    } catch (err) {
      alert("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/orders", { replace: true });
  };

  if (items.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FAF9F6] px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ShoppingBag size={48} className="text-gray-300 mb-4" />
          <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/dining")}
            className="bg-[#1a1a1a] text-white px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#C6A45C]"
          >
            Return to Menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 mt-20">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleSuccessClose}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 p-6"
                >
                  <CheckCircle size={48} className="text-emerald-500" />
                </motion.div>

                <h2 className="text-3xl font-serif font-bold mb-4 text-gray-800">
                  Order Placed!
                </h2>
                <p className="text-gray-600 mb-2 text-lg">
                  Order #{successOrder?.orderNumber || "123456"}
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Estimated delivery in 30-45 mins
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Total Amount:</span>
                    <span className="font-bold text-[#C6A45C]">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Payment:</span>
                    <span>COD</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSuccessClose}
                  className="w-full bg-[#1a1a1a] text-white py-4 text-xs font-bold tracking-[0.3em] uppercase rounded-xl shadow-lg hover:bg-black transition-all"
                >
                  Track Order
                </motion.button>

                <p className="text-[10px] text-gray-400 mt-4 tracking-wider">
                  You'll get order updates via SMS
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border-b border-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Back
            </span>
          </button>

          <h1 className="text-xl font-serif font-bold">Checkout</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-6 text-[#C6A45C]">
              Your Selection
            </h2>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-6 border border-gray-100 rounded-xl hover:shadow-md transition-all flex gap-4 items-center"
                  >
                    <img
                      src={item.images?.[0] || "https://placehold.co/100x100"}
                      className="w-20 h-20 object-cover rounded-lg shadow-sm"
                      alt={item.name}
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-semibold text-lg truncate">
                        {item.name}
                      </h3>
                      <p className="text-[#C6A45C] font-bold mt-1 text-lg">
                        ₹{item.basePrice}
                      </p>

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => decreaseQty(item._id)}
                            className="px-4 py-2 hover:bg-gray-50 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold py-2">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => increaseQty(item._id)}
                            className="px-4 py-2 hover:bg-gray-50 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <p className="font-bold text-xl whitespace-nowrap">
                      ₹{(item.basePrice * item.qty).toFixed(0)}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-lg sticky top-8">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-6 text-[#C6A45C]">
                Order Summary
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckout();
                }}
                className="space-y-4 mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={20} className="text-[#C6A45C]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
                    Delivery Address
                  </span>
                </div>

                <input
                  name="fullName"
                  type="text"
                  required
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="Full Name *"
                  className="w-full border border-gray-200 px-4 py-3 text-sm rounded-xl outline-none focus:border-[#C6A45C] focus:ring-2 focus:ring-[#C6A45C]/20 transition-all"
                />

                <input
                  name="phone"
                  type="tel"
                  required
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="Phone Number *"
                  className="w-full border border-gray-200 px-4 py-3 text-sm rounded-xl outline-none focus:border-[#C6A45C] focus:ring-2 focus:ring-[#C6A45C]/20 transition-all"
                />

                <select
                  required
                  value={address.stateCode}
                  onChange={handleStateChange}
                  className="w-full border border-gray-200 px-4 py-3 text-sm rounded-xl outline-none focus:border-[#C6A45C] focus:ring-2 focus:ring-[#C6A45C]/20 transition-all"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <select
                  required
                  value={address.city}
                  onChange={handleCityChange}
                  disabled={!address.stateCode}
                  className="w-full border border-gray-200 px-4 py-3 text-sm rounded-xl outline-none focus:border-[#C6A45C] focus:ring-2 focus:ring-[#C6A45C]/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <input
                  name="street"
                  type="text"
                  required
                  value={address.street}
                  onChange={handleChange}
                  placeholder="Street Address, House No. *"
                  className="w-full border border-gray-200 px-4 py-3 text-sm rounded-xl outline-none focus:border-[#C6A45C] focus:ring-2 focus:ring-[#C6A45C]/20 transition-all"
                />

                <input
                  name="pincode"
                  type="text"
                  required
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="Pincode *"
                  className="w-full border border-gray-200 px-4 py-3 text-sm rounded-xl outline-none focus:border-[#C6A45C] focus:ring-2 focus:ring-[#C6A45C]/20 transition-all"
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="w-full bg-[#1a1a1a] text-white py-5 text-[11px] font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-3 rounded-xl shadow-xl hover:shadow-2xl hover:bg-black focus:outline-none focus:ring-4 focus:ring-[#C6A45C]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <CreditCard size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span>Service Tax (5%)</span>
                  <span>₹{taxes.toLocaleString()}</span>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-[#C6A45C]">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-center text-[9px] text-gray-400 uppercase tracking-widest mt-8 pt-6 border-t">
                🔒 Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
