/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo } from "react";
import { useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axiosClient";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ShoppingBag,
  MapPin,
  Plus,
  CheckCircle2,
  Home,
  Briefcase,
  X,
  Navigation,
  Trash2,
  Edit2,
} from "lucide-react";
// import { City } from "country-state-city";

export default function Checkout() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { cart, removeItem, addItem, clearCart } = useCartStore();
  const { user, accessToken } = useSelector((state) => state.auth);
  const { address, setAddressField, clearAddress } = useCheckoutStore();

  // const [cities] = useState(() => City.getCitiesOfCountry("IN"));
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addressTag, setAddressTag] = useState("Home");

  const items = useMemo(() => cart?.items || [], [cart]);
  useEffect(() => {
    if (!accessToken) {
      navigate("/login", {
        state: {
          redirectPath: "/checkout",
        },
      });
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axiosClient.get("/addresses");
        setSavedAddresses(res.data.addresses || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAddresses();
  }, []);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const taxes = subtotal * 0.05;
  const total = subtotal + taxes;

  // const isAddressValid = useMemo(() => {
  //   const pinRegex = /^[1-9][0-9]{5}$/;
  //   return (
  //     address.street?.trim().length >= 3 &&
  //     address.landmark?.trim().length >= 3 &&
  //     address.city?.trim().length >= 2 &&
  //     pinRegex.test(address.pincode)
  //   );
  // }, [address]);

  const isAddressValid = useMemo(() => {
  return (
    address.street?.trim().length >= 3 &&
    address.landmark?.trim().length >= 3
  );
}, [address]);

  const handleAddNewAddress = async () => {
    if (!isAddressValid) return;
    try {
      const payload = { ...address, label: addressTag };
      let res;
      if (editingId) {
        res = await axiosClient.patch(`/addresses/${editingId}`, payload);
        setSavedAddresses((prev) =>
          prev.map((a) => (a._id === editingId ? res.data.address : a)),
        );
        setEditingId(null);
      } else {
        res = await axiosClient.post("/addresses", payload);
        setSavedAddresses((prev) => [...prev, res.data.address]);
      }
      setSelectedAddress(res.data.address);
      setShowForm(false);
      clearAddress();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axiosClient.delete(`/addresses/${id}`);
      setSavedAddresses((prev) => prev.filter((a) => a._id !== id));
      if (selectedAddress?._id === id) setSelectedAddress(null);
    } catch (err) {
      alert("Failed to delete address");
    }
  };

  // const handleEditAddress = (addr) => {
  //   setEditingId(addr._id);
  //   setAddressField("street", addr.street);
  //   setAddressField("landmark", addr.landmark);
  //   setAddressField("city", addr.city);
  //   setAddressField("pincode", addr.pincode);
  //   setAddressTag(addr.label);
  //   setShowForm(true);
  // };


  const handleEditAddress = (addr) => {
  setEditingId(addr._id);
  setAddressField("street", addr.street);
  setAddressField("landmark", addr.landmark);
  setAddressTag(addr.label);
  setShowForm(true);
};
  const handleOrder = async () => {
    if (!selectedAddress || loading) return;

    setLoading(true);

    try {
      console.log("$$$ items", items)
      const payload = {
        items: items.map((i) => {
          if (i.combo) {
            return {
              combo: i.dishId || i._id,
              quantity: i.quantity,
            };
          }

          return {
            menuItem: i.dishId || i._id,
            quantity: i.quantity,
          };
        }),
        address: selectedAddress,
      };
      console.log("$$$ payload",payload);
      const res = await axiosClient.post("/orders", payload);

      const order = res.data.data;

      clearCart();
      clearAddress();

      navigate("/order-success", {
        state: {
          orderId: order._id,
          orderNumber: order.orderNumber,
        },
      });
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  const animationVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98 },
  };

  if (!items.length) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#FAFAFA]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animationVariants}
          className="max-w-md w-full text-center"
        >
          <div className="relative inline-block mb-6">
            <ShoppingBag
              size={80}
              strokeWidth={1}
              className="text-[#C6A45C]/20"
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-1 -right-1 bg-[#C6A45C] p-2 rounded-full text-white shadow-lg"
            >
              <Plus size={16} />
            </motion.div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gray-800">
            Your Cart is empty
          </h2>
          <p className="text-gray-500 mt-3 mb-10 text-base">
            Add some delicacies to your cart to proceed.
          </p>
          <button
            onClick={() => navigate("/dining")}
            className="w-full sm:w-auto bg-[#C6A45C] text-white px-12 py-4 rounded-full font-bold hover:bg-[#b08f4b] transition-all shadow-xl active:scale-95"
          >
            Explore Menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden">
            <div className="flex items-center gap-4 min-w-0">
              <div className="bg-green-100 p-2.5 rounded-full flex-shrink-0">
                <CheckCircle2 className="text-green-600" size={20} />
              </div>
              <div className="truncate">
                <p className="text-[10px] font-bold text-[#C6A45C] uppercase tracking-[0.2em] mb-0.5">
                  Account
                </p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {user?.fullName}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="text-[#C6A45C]" size={24} />
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
                Delivery Address
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {savedAddresses.map((addr) => (
                <motion.div
                  layout
                  key={addr._id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`group p-5 rounded-xl cursor-pointer border-2 transition-all relative flex flex-col justify-between h-full ${
                    selectedAddress?._id === addr._id
                      ? "border-[#C6A45C] bg-[#C6A45C]/5 shadow-md"
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={
                        selectedAddress?._id === addr._id
                          ? "text-[#C6A45C]"
                          : "text-gray-400"
                      }
                    >
                      {addr.label === "Home" ? (
                        <Home size={18} />
                      ) : addr.label === "Work" ? (
                        <Briefcase size={18} />
                      ) : (
                        <MapPin size={18} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm mb-1">
                        {addr.label}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {/* {addr.street}, {addr.landmark}, {addr.city} -{" "}
                        {addr.pincode} */}
                        {addr.street}, {addr.landmark}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress(addr);
                        }}
                        className="text-[10px] uppercase font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(addr._id);
                        }}
                        className="text-[10px] uppercase font-bold text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                    {selectedAddress?._id === addr._id && (
                      <CheckCircle2 size={16} className="text-green-600" />
                    )}
                  </div>
                </motion.div>
              ))}

              {!showForm && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    clearAddress();
                    setShowForm(true);
                  }}
                  className="border-2 border-dashed border-gray-200 p-8 rounded-xl flex flex-col items-center justify-center gap-3 group hover:border-[#C6A45C] hover:bg-gray-50 transition-all min-h-[140px]"
                >
                  <div className="bg-gray-100 group-hover:bg-[#C6A45C]/10 p-3 rounded-full transition-colors">
                    <Plus
                      className="text-gray-400 group-hover:text-[#C6A45C]"
                      size={24}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                    Add New Address
                  </span>
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {showForm && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={animationVariants}
                  className="bg-gray-50 p-5 sm:p-8 rounded-2xl border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                      <Navigation size={18} className="text-[#C6A45C]" />
                      {editingId ? "Update Address" : "New Delivery Details"}
                    </h4>
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                        clearAddress();
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
                        Flat / House No.
                      </label>
                      <input
                        required
                        name="street"
                        value={address.street || ""}
                        placeholder="e.g. 402, Royal Residency"
                        className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-[#C6A45C]/20 focus:border-[#C6A45C] outline-none p-3.5 rounded-xl text-sm transition-all"
                        onChange={(e) =>
                          setAddressField(e.target.name, e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
                        Landmark
                      </label>
                      <input
                        required
                        name="landmark"
                        value={address.landmark || ""}
                        placeholder="e.g. Near City Mall"
                        className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-[#C6A45C]/20 focus:border-[#C6A45C] outline-none p-3.5 rounded-xl text-sm transition-all"
                        onChange={(e) =>
                          setAddressField(e.target.name, e.target.value)
                        }
                      />
                    </div>
                    {/* <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
                        City
                      </label>
                      <select
                        required
                        name="city"
                        value={address.city || ""}
                        className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-[#C6A45C]/20 focus:border-[#C6A45C] outline-none p-3.5 rounded-xl text-sm transition-all appearance-none cursor-pointer"
                        onChange={(e) =>
                          setAddressField(e.target.name, e.target.value)
                        }
                      >
                        <option value="" disabled hidden>
                          Select City
                        </option>
                        {cities.map((c, idx) => (
                          <option key={idx} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div> */}
                    <div className="space-y-1.5">
                      {/* <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">
                        Pincode (6 Digits)
                      </label> */}
                      {/* <input
                        required
                        name="pincode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="e.g. 400001"
                        value={address.pincode || ""}
                        className="w-full bg-white border border-gray-200 focus:ring-2 focus:ring-[#C6A45C]/20 focus:border-[#C6A45C] outline-none p-3.5 rounded-xl text-sm transition-all"
                        onChange={(e) =>
                          setAddressField(
                            e.target.name,
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                      /> */}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    {["Home", "Work", "Other"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setAddressTag(tag)}
                        className={`flex-1 py-3 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all ${
                          addressTag === tag
                            ? "border-[#C6A45C] text-[#C6A45C] bg-white shadow-sm"
                            : "border-gray-200 text-gray-400 bg-transparent hover:bg-gray-100"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={!isAddressValid}
                    onClick={handleAddNewAddress}
                    className="w-full mt-6 py-4 bg-[#C6A45C] text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-lg disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-[0.98]"
                  >
                    {editingId
                      ? "Update & Use Address"
                      : "Save & Use This Address"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-serif font-bold mb-8 text-gray-900">
              Review Items
            </h3>
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.dishId}
                  className="flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-sm"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm sm:text-base truncate">
                        {item.name}
                      </p>
                      <p className="text-[#C6A45C] font-black text-sm mt-0.5">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                    <button
                      onClick={() => removeItem(item.dishId)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-black text-xs">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        addItem({
                          _id: item.dishId,
                          name: item.name,
                          basePrice: item.price,
                          images: [{ url: item.image }],
                        })
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-[#C6A45C] font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-black/5 border border-gray-100">
            <h4 className="text-xl font-serif font-bold mb-8 text-gray-900">
              Bill Summary
            </h4>
            <div className="space-y-5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Item Total</span>
                <span className="font-bold text-gray-900">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-black tracking-widest text-[10px] uppercase bg-green-50 px-2 py-1 rounded">
                  Free
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Taxes & Charges (5%)</span>
                <span className="font-bold text-gray-900">
                  ₹{Math.round(taxes).toLocaleString()}
                </span>
              </div>

              <div className="h-px bg-gray-100 my-6" />

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] mb-1">
                    Grand Total
                  </p>
                  <p className="text-3xl sm:text-4xl font-serif font-black text-gray-900">
                    ₹{Math.round(total).toLocaleString()}
                  </p>
                </div>
                <div className="text-[10px] text-green-700 font-black bg-green-100 px-3 py-1.5 rounded-full uppercase tracking-tighter">
                  Saved ₹45
                </div>
              </div>

              <button
                disabled={!selectedAddress || loading}
                onClick={handleOrder}
                className={`w-full mt-8 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs sm:text-sm transition-all shadow-xl ${
                  selectedAddress
                    ? "bg-[#C6A45C] text-white hover:bg-[#b08f4b] hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                    >
                      <Navigation size={18} />
                    </motion.div>
                    Processing...
                  </div>
                ) : (
                  "Place Order"
                )}
              </button>

              {!selectedAddress && (
                <p className="text-[10px] text-center text-red-400 font-bold uppercase tracking-wider mt-4">
                  Please select a delivery address to proceed
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
