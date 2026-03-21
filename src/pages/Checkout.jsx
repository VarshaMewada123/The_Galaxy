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
  Lock,
  Minus,
  ArrowRight
} from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { cart, removeItem, addItem, clearCart } = useCartStore();
  const { user, accessToken } = useSelector((state) => state.auth);
  const { address, setAddressField, clearAddress } = useCheckoutStore();

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [addressTag, setAddressTag] = useState("Home");

  const items = useMemo(() => cart?.items || [], [cart]);

  useEffect(() => {
    if (!accessToken) return;
    const fetchAddresses = async () => {
      try {
        const res = await axiosClient.get("/addresses");
        setSavedAddresses(res.data.addresses || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAddresses();
  }, [accessToken]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.05;
  const total = subtotal + taxes;

  const isAddressValid = useMemo(() => {
    return address.street?.trim().length >= 3 && address.landmark?.trim().length >= 3;
  }, [address]);

  const handleAddNewAddress = async () => {
    if (!isAddressValid) return;
    try {
      const payload = { ...address, label: addressTag };
      let res;
      if (editingId) {
        res = await axiosClient.patch(`/addresses/${editingId}`, payload);
        setSavedAddresses((prev) => prev.map((a) => (a._id === editingId ? res.data.address : a)));
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

  const handleEditAddress = (addr) => {
    setEditingId(addr._id);
    setAddressField("street", addr.street);
    setAddressField("landmark", addr.landmark);
    setAddressTag(addr.label);
    setShowForm(true);
  };

  const handleOrder = async () => {
    if (!selectedAddress || loading || !accessToken) return;
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({
          [i.combo ? "combo" : "menuItem"]: i.dishId || i._id,
          quantity: i.quantity,
        })),
        addressId: selectedAddress._id,
      };
      const res = await axiosClient.post("/orders", payload);
      const order = res.data.data;
      clearCart();
      clearAddress();
      navigate("/order-success", { state: { orderId: order._id, orderNumber: order.orderNumber } });
    } catch (err) {
      alert(err?.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  const anim = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { opacity: 1, y: 0 },
  };

  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] px-4">
        <motion.div initial="hidden" animate="visible" variants={anim} className="text-center">
          <ShoppingBag size={64} className="mx-auto text-[#C6A45C] mb-6 opacity-20" />
          <h2 className="text-3xl font-serif font-bold text-charcoal mb-4">Your Cart is Empty</h2>
          <button onClick={() => navigate("/dining")} className="bg-[#C6A45C] text-white px-8 py-3 rounded-full font-bold hover:bg-[#b08f4b] transition-all">
            Explore Menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
        
       
        <div className="lg:col-span-8 space-y-8">
          
     
          <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            {!accessToken ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900">Account</h3>
                  <p className="text-gray-500 text-sm">Log in or sign up to finalize your order.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => navigate("/login")} className="px-6 py-2.5 border-2 border-[#C6A45C] text-[#C6A45C] font-bold rounded-xl text-sm">LOG IN</button>
                  <button onClick={() => navigate("/signup")} className="px-6 py-2.5 bg-[#C6A45C] text-white font-bold rounded-xl text-sm">SIGN UP</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-2 rounded-full">
                  <CheckCircle2 className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#C6A45C] font-bold">Logged In</p>
                  <p className="font-bold text-gray-900">{user?.fullName}</p>
                </div>
              </div>
            )}
          </section>

          {/* Section 2: Address */}
          <section className={`bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-opacity ${!accessToken && "opacity-40 pointer-events-none"}`}>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-[#C6A45C]" size={22} />
              <h3 className="text-xl font-serif font-bold text-gray-900">Delivery Address</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <div 
                  key={addr._id} 
                  onClick={() => setSelectedAddress(addr)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${selectedAddress?._id === addr._id ? "border-[#C6A45C] bg-[#C6A45C]/5" : "border-gray-50 bg-[#FAFAF9] hover:border-gray-200"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C6A45C]">{addr.label}</span>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }} className="p-1 hover:text-blue-600"><Edit2 size={14}/></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr._id); }} className="p-1 hover:text-red-600"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">{addr.street}</p>
                  <p className="text-xs text-gray-500">{addr.landmark}</p>
                  {selectedAddress?._id === addr._id && <CheckCircle2 size={16} className="absolute bottom-4 right-4 text-[#C6A45C]" />}
                </div>
              ))}

              <button 
                onClick={() => { setEditingId(null); clearAddress(); setShowForm(true); }}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-[#C6A45C] hover:text-[#C6A45C] transition-all"
              >
                <Plus size={24} className="mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Add New</span>
              </button>
            </div>

            {/* Address Form Modal/Overlay logic could go here, or inline: */}
            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 pt-6 border-t overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <input name="street" value={address.street || ""} placeholder="Flat/House No." className="bg-gray-50 border p-3 rounded-xl text-sm outline-none focus:border-[#C6A45C]" onChange={(e) => setAddressField(e.target.name, e.target.value)} />
                    <input name="landmark" value={address.landmark || ""} placeholder="Landmark" className="bg-gray-50 border p-3 rounded-xl text-sm outline-none focus:border-[#C6A45C]" onChange={(e) => setAddressField(e.target.name, e.target.value)} />
                  </div>
                  <div className="flex gap-2 mb-4">
                    {["Home", "Work", "Other"].map(tag => (
                      <button key={tag} onClick={() => setAddressTag(tag)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${addressTag === tag ? "bg-[#C6A45C] text-white border-[#C6A45C]" : "bg-white text-gray-400"}`}>{tag}</button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowForm(false)} className="flex-1 py-3 text-sm font-bold text-gray-400">Cancel</button>
                    <button onClick={handleAddNewAddress} disabled={!isAddressValid} className="flex-1 py-3 bg-[#C6A45C] text-white rounded-xl text-sm font-bold disabled:bg-gray-200">Save Address</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Section 3: Items */}
          <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Review Items</h3>
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
                <div key={item.dishId || item._id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover bg-gray-50" />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{item.name}</p>
                      <p className="text-[#C6A45C] font-bold text-sm">₹{item.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-[#FAFAF9] rounded-xl p-1 border border-gray-100">
                    <button onClick={() => removeItem(item.dishId || item._id)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-400 hover:text-red-500">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-gray-900">{item.quantity}</span>
                    <button onClick={() => addItem({ ...item, _id: item.dishId || item._id, basePrice: item.price })} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-[#C6A45C]">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Sidebar Bill */}
        <aside className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-black/5 sticky top-28">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Bill Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Item Total</span>
                <span className="font-bold text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Taxes & Charges (5%)</span>
                <span className="font-bold text-gray-900">₹{Math.round(taxes).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-0.5 rounded">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-1">Grand Total</p>
                  <p className="text-4xl font-serif font-black text-gray-900">₹{Math.round(total).toLocaleString()}</p>
                </div>
                <p className="text-[10px] text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">Secure Checkout</p>
              </div>
            </div>

            <button
              disabled={!selectedAddress || !accessToken || loading}
              onClick={handleOrder}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-sm transition-all flex items-center justify-center gap-3 ${
                selectedAddress && accessToken
                  ? "bg-[#C6A45C] text-white hover:bg-[#b08f4b] shadow-lg shadow-[#C6A45C]/20"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Navigation size={18} />
                </motion.div>
              ) : (
                <>
                  PROCEED TO PAYMENT
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {!accessToken && (
              <p className="text-center text-[10px] text-red-500 font-bold uppercase tracking-tighter mt-4 flex items-center justify-center gap-1">
                <Lock size={10} /> Login Required to continue
              </p>
            )}
            {accessToken && !selectedAddress && (
              <p className="text-center text-[10px] text-[#C6A45C] font-bold uppercase tracking-tighter mt-4">
                Select a delivery address
              </p>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}