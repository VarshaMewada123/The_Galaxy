import { useEffect, useState, useMemo } from "react";
import { useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/api/axiosClient";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  ShoppingBag,
  MapPin,
  Plus,
  CheckCircle2,
  X,
  Trash2,
  Edit2,
  Lock,
  Minus,
  ArrowRight,
  Clock,
  UtensilsCrossed,
  ArrowLeft,
  Home,
  Briefcase,
  ChevronRight
} from "lucide-react";

const TanToaster = () => (
  <Toaster 
    position="top-center" 
    toastOptions={{ 
      style: { 
        background: "#FFFFFF", 
        color: "#1A1A1A", 
        border: "1px solid #C6A45C", 
        borderRadius: "16px", 
        fontSize: "14px", 
        fontWeight: "600" 
      } 
    }} 
  />
);

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
  const [availability, setAvailability] = useState(null);
  const [showClosedModal, setShowClosedModal] = useState(false);

  const items = useMemo(() => cart?.items || [], [cart]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requests = [axiosClient.get("/admin/availability")];
        if (accessToken) requests.push(axiosClient.get("/addresses"));
        const [availRes, addrRes] = await Promise.all(requests);
        setAvailability(availRes.data.data);
        if (addrRes) setSavedAddresses(addrRes.data.addresses || []);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchData();
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
      toast.success("Address saved successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axiosClient.delete(`/addresses/${id}`);
      setSavedAddresses((prev) => prev.filter((a) => a._id !== id));
      if (selectedAddress?._id === id) setSelectedAddress(null);
      toast.success("Address removed");
    } catch (err) {
      toast.error("Failed to delete address");
    }
  };

  const handleEditAddress = (addr) => {
    setEditingId(addr._id);
    setAddressField("street", addr.street);
    setAddressField("landmark", addr.landmark);
    setAddressTag(addr.label);
    setShowForm(true);
  };

  // const handleOrder = async () => {
  //   if (!accessToken) return toast.error("Please login to continue");
  //   if (!selectedAddress) return toast.error("Please select a delivery address");

  //   // Logic Fix: Ensure strict time comparison
  //   const now = new Date();
  //   const currentTime = now.getHours() * 100 + now.getMinutes(); 
    
  //   const startTime = availability?.kitchenStartTime ? parseInt(availability.kitchenStartTime.replace(":", "")) : 1000;
  //   const endTime = availability?.kitchenEndTime ? parseInt(availability.kitchenEndTime.replace(":", "")) : 2300;

  //   const isClosed = !availability?.isOrderingEnabled || 
  //                    availability?.isTemporarilyClosed || 
  //                    (currentTime < startTime || currentTime > endTime);

  //   if (isClosed) {
  //     setShowClosedModal(true);
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const payload = {
  //       items: items.map((i) => ({
  //         [i.combo ? "combo" : "menuItem"]: i.dishId || i._id,
  //         quantity: i.quantity,
  //       })),
  //       addressId: selectedAddress._id,
  //     };
  //     const res = await axiosClient.post("/orders", payload);
  //     clearCart();
  //     clearAddress();
  //     navigate("/order-success", { state: { orderId: res.data.data._id, orderNumber: res.data.data.orderNumber } });
  //   } catch (err) {
  //     toast.error(err?.response?.data?.message || "Order placement failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleOrder = async () => {
  if (!accessToken) return toast.error("Please login to continue");
  if (!selectedAddress) return toast.error("Please select a delivery address");

  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const startTime = availability?.kitchenStartTime
    ? parseInt(availability.kitchenStartTime.replace(":", ""))
    : 1000;

  const endTime = availability?.kitchenEndTime
    ? parseInt(availability.kitchenEndTime.replace(":", ""))
    : 2300;

  const isClosed =
    !availability?.isOrderingEnabled ||
    availability?.isTemporarilyClosed ||
    currentTime < startTime ||
    currentTime > endTime;

  if (isClosed) {
    setShowClosedModal(true);
    return;
  }

  setLoading(true);

  try {
    // 🧾 STEP 1: Create Razorpay Order
    const { data } = await axiosClient.post("/payment/create-order", {
      amount: Math.round(total),
    });

    const order = data.order;

    // 💳 STEP 2: Open Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Hotel Galaxy",
      description: "Food Order Payment",
      order_id: order.id,

      handler: async function (response) {
        try {
          // ✅ STEP 3: Verify Payment
          await axiosClient.post("/payment/verify-payment", response);

          // ✅ STEP 4: CREATE ORDER AFTER PAYMENT
          const payload = {
            items: items.map((i) => ({
              [i.combo ? "combo" : "menuItem"]: i.dishId || i._id,
              quantity: i.quantity,
            })),
            addressId: selectedAddress._id,
            paymentId: response.razorpay_payment_id,
          };

          const res = await axiosClient.post("/orders", payload);

          clearCart();
          clearAddress();

          navigate("/order-success", {
            state: {
              orderId: res.data.data._id,
              orderNumber: res.data.data.orderNumber,
            },
          });

        } catch (err) {
          toast.error("Payment verification failed");
        }
      },

      prefill: {
        name: user?.fullName,
        email: user?.email,
      },

      theme: {
        color: "#C6A45C",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    toast.error(err?.response?.data?.message || "Payment failed");
  } finally {
    setLoading(false);
  }
};
  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <ShoppingBag size={80} className="mx-auto text-[#C6A45C] mb-6 opacity-20" />
          <h2 className="text-4xl font-serif font-black text-[#1A1A1A] mb-4">Empty Palette</h2>
          <p className="text-gray-500 mb-8">Your culinary journey starts with a single dish.</p>
          <button onClick={() => navigate("/dining")} className="bg-[#C6A45C] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[#b08f4b] transition-all shadow-xl shadow-[#C6A45C]/20 cursor-pointer">
            Explore Menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-24 pb-20 px-4 sm:px-6 lg:px-12">
      <TanToaster />

      <AnimatePresence>
        {showClosedModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowClosedModal(false)}
              className="absolute inset-0 bg-[#1A1A1A]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full relative z-10 text-center border border-[#C6A45C]/20 shadow-2xl"
            >
              <button onClick={() => setShowClosedModal(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <X size={20} className="text-gray-400" />
              </button>
              <div className="bg-[#FAF9F6] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <UtensilsCrossed className="text-[#C6A45C]" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-black text-[#1A1A1A] mb-3">Kitchen at Rest</h3>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">We are currently refining our flavors. Please join us during our operating hours.</p>
              <div className="bg-[#FAF9F6] rounded-2xl p-5 flex justify-between items-center mb-8">
                <div className="flex-1 text-center border-r border-gray-200">
                  <p className="text-[10px] uppercase font-black text-[#C6A45C] mb-1">Opens</p>
                  <p className="text-lg font-black text-[#1A1A1A]">{availability?.kitchenStartTime || "10:00"}</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[10px] uppercase font-black text-[#C6A45C] mb-1">Closes</p>
                  <p className="text-lg font-black text-[#1A1A1A]">{availability?.kitchenEndTime || "23:00"}</p>
                </div>
              </div>
              <button onClick={() => setShowClosedModal(false)} className="w-full py-4 bg-[#C6A45C] text-white rounded-xl font-black uppercase tracking-widest text-[10px] cursor-pointer hover:bg-[#b08f4b] transition-all">
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#C6A45C] transition-colors cursor-pointer"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:border-[#C6A45C]">
                  <ArrowLeft size={16} />
                </div>
                
              </button>
              <h1 className="text-3xl font-serif font-black text-[#1A1A1A]">Checkout</h1>
            </div>
          </div>

          <section className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm">
            {!accessToken ? (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-serif font-black text-[#1A1A1A]">Guest Access</h3>
                  <p className="text-gray-400 text-sm mt-1">Identify yourself to proceed to the galaxy of tastes.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => navigate("/login")} className="px-6 py-3 border-2 border-[#C6A45C] text-[#C6A45C] font-black rounded-xl text-[10px] tracking-widest uppercase cursor-pointer hover:bg-[#C6A45C]/5 transition-all">Log In</button>
                  <button onClick={() => navigate("/signup")} className="px-6 py-3 bg-[#C6A45C] text-white font-black rounded-xl text-[10px] tracking-widest uppercase cursor-pointer hover:bg-[#b08f4b] transition-all">Sign Up</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="bg-[#C6A45C]/10 p-3 rounded-2xl">
                  <CheckCircle2 className="text-[#C6A45C]" size={24} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#C6A45C] font-black">Logged In</p>
                  <p className="font-serif font-black text-xl text-[#1A1A1A]">{user?.fullName}</p>
                </div>
              </div>
            )}
          </section>

          <section className={`bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm transition-all ${!accessToken && "opacity-40 grayscale pointer-events-none"}`}>
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="text-[#C6A45C]" size={24} />
              <h3 className="text-xl font-serif font-black text-[#1A1A1A]">Shipping Essence</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <motion.div 
                  whileHover={{ y: -4 }}
                  key={addr._id} 
                  onClick={() => setSelectedAddress(addr)}
                  className={`p-6 rounded-[1.5rem] border-2 cursor-pointer transition-all relative ${selectedAddress?._id === addr._id ? "border-[#C6A45C] bg-[#C6A45C]/5" : "border-[#FAF9F6] bg-[#FAF9F6] hover:border-gray-200"}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#C6A45C] bg-white px-3 py-1.5 rounded-lg border border-[#C6A45C]/10 shadow-sm">
                      {addr.label === "Home" && <Home size={12} />}
                      {addr.label === "Work" && <Briefcase size={12} />}
                      {addr.label === "Other" && <MapPin size={12} />}
                      {addr.label}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }} className="p-2 bg-white rounded-lg hover:text-[#C6A45C] transition-colors shadow-sm cursor-pointer"><Edit2 size={14}/></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(addr._id); }} className="p-2 bg-white rounded-lg hover:text-red-500 transition-colors shadow-sm cursor-pointer"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <p className="text-sm font-black text-[#1A1A1A] mb-1">{addr.street}</p>
                  <p className="text-xs text-gray-500 font-medium truncate">{addr.landmark}</p>
                </motion.div>
              ))}

              <button 
                onClick={() => { setEditingId(null); clearAddress(); setShowForm(true); }}
                className="border-2 border-dashed border-gray-200 rounded-[1.5rem] p-6 flex flex-col items-center justify-center text-gray-400 hover:border-[#C6A45C] hover:text-[#C6A45C] transition-all group min-h-[140px] cursor-pointer"
              >
                <div className="p-3 bg-gray-50 rounded-full mb-3 group-hover:bg-[#C6A45C]/10 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">New Address</span>
              </button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-8 pt-8 border-t border-dashed border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Flat / House No.</label>
                      <input name="street" value={address.street || ""} className="w-full bg-[#FAF9F6] border-none p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C6A45C]/20 transition-all text-[#1A1A1A]" onChange={(e) => setAddressField(e.target.name, e.target.value)} placeholder="e.g. Penthouse 402" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Landmark</label>
                      <input name="landmark" value={address.landmark || ""} className="w-full bg-[#FAF9F6] border-none p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#C6A45C]/20 transition-all text-[#1A1A1A]" onChange={(e) => setAddressField(e.target.name, e.target.value)} placeholder="e.g. Near Royal Plaza" />
                    </div>
                  </div>
                  <div className="flex gap-3 mb-8">
                    {[
                      {id: "Home", icon: <Home size={14}/>}, 
                      {id: "Work", icon: <Briefcase size={14}/>}, 
                      {id: "Other", icon: <MapPin size={14}/>}
                    ].map(tag => (
                      <button 
                        key={tag.id} 
                        type="button"
                        onClick={() => setAddressTag(tag.id)} 
                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center justify-center gap-2 transition-all cursor-pointer ${addressTag === tag.id ? "bg-[#C6A45C] text-white border-[#C6A45C] shadow-xl" : "bg-white text-gray-400 border-gray-100 hover:border-[#C6A45C]"}`}
                      >
                        {tag.icon} {tag.id}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setShowForm(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer hover:text-red-500 transition-colors">Discard</button>
                    <button onClick={handleAddNewAddress} disabled={!isAddressValid} className="flex-1 py-4 bg-[#C6A45C] text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:bg-gray-200 cursor-pointer shadow-lg shadow-[#C6A45C]/20">Save Destination</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <section className="bg-white rounded-[2rem] p-6 sm:p-8 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-serif font-black text-[#1A1A1A]">Curated Selection</h3>
              <button 
                onClick={() => navigate("/dining")}
                className="text-[10px] font-black uppercase tracking-widest text-[#C6A45C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Add More <Plus size={14} />
              </button>
            </div>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.dishId || item._id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-[#FAF9F6] border border-gray-50 shadow-sm" />
                    <div>
                      <p className="font-serif font-black text-[#1A1A1A] text-sm sm:text-base">{item.name}</p>
                      <p className="text-[#C6A45C] font-black text-xs mt-0.5">₹{item.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center bg-[#FAF9F6] rounded-xl p-1 border border-gray-100">
                    <button onClick={() => removeItem(item.dishId || item._id)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-gray-400 hover:text-red-500 cursor-pointer"><Minus size={14} /></button>
                    <span className="w-8 text-center font-black text-xs text-[#1A1A1A]">{item.quantity}</span>
                    <button onClick={() => addItem({ ...item, _id: item.dishId || item._id, basePrice: item.price })} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-[#C6A45C] cursor-pointer"><Plus size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-2xl shadow-[#1A1A1A]/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6A45C]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <h3 className="text-2xl font-serif font-black text-[#1A1A1A] mb-8 relative z-10">Summary</h3>
            
            <div className="space-y-4 mb-8 relative z-10">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-900">Subtotal</span>
                <span className="text-[#1A1A1A]">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-gray-900">Gratuity & Tax (5%)</span>
                <span className="text-[#1A1A1A]">₹{Math.round(taxes).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-black uppercase tracking-widest text-[10px]">Delivery</span>
                <span className="text-green-600 font-black text-[9px] bg-green-50 px-3 py-1 rounded-full uppercase tracking-tighter">Free</span>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-[#FAF9F6] pt-8 mb-8 text-center relative z-10">
              <p className="text-[10px] font-black text-[#C6A45C] uppercase tracking-[0.3em] mb-2">Grand Total</p>
              <p className="text-5xl font-serif font-black text-[#1A1A1A]">₹{Math.round(total).toLocaleString()}</p>
            </div>

            <button
              disabled={!selectedAddress || !accessToken || loading}
              onClick={handleOrder}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3 cursor-pointer ${
                selectedAddress && accessToken
                  ? "bg-[#C6A45C] text-white hover:bg-[#b08f4b] shadow-xl"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? <Clock className="animate-spin" size={18} /> : <>Confirm Order <ChevronRight size={18} /></>}
            </button>

            {!accessToken ? (
              <p className="text-center text-[9px] text-red-500 font-black uppercase tracking-widest mt-6 flex items-center justify-center gap-2 bg-red-50 py-3 rounded-xl">
                <Lock size={12} /> Login to Checkout
              </p>
            ) : !selectedAddress ? (
              <p className="text-center text-[9px] text-[#C6A45C] font-black uppercase tracking-widest mt-6 bg-[#C6A45C]/5 py-3 rounded-xl border border-[#C6A45C]/10">
                Please select an address
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}