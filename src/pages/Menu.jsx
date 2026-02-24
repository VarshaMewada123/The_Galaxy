import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useMemo } from "react";
import { useCartStore } from "@/store/cart.store";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight, Plus, Minus } from "lucide-react";

const fetchMenu = async () => {
  const { data } = await axiosClient.get("/menu");
  return data.data;
};

export default function Menu() {
  const navigate = useNavigate();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenu,
  });

  const groupedMenu = useMemo(() => {
    const grouped = {};
    items.forEach((item) => {
      const category = item.category?.name || "Signature Specials";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });
    return grouped;
  }, [items]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF9F6]">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-[#C6A45C] tracking-[0.3em] font-serif text-xl"
        >
          RIVORA
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-32">
      {/* Luxury Header */}
      <div className="bg-white border-b border-gray-100 pt-16 pb-10 px-4 mb-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#C6A45C] text-[10px] tracking-[0.4em] uppercase font-bold"
          >
            Culinary Excellence
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif mt-2"
          >
            Our Menu
          </motion.h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {Object.entries(groupedMenu).map(([category, list], idx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl md:text-2xl font-serif text-[#1a1a1a] whitespace-nowrap">
                {category}
              </h2>
              <div className="h-[1px] w-full bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {list.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <StickyCart navigate={navigate} />
    </div>
  );
}

function MenuItemCard({ item }) {
  const { addItem, increaseQty, decreaseQty, items } = useCartStore();
  const cartItem = items.find((i) => i._id === item._id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white border border-gray-100 p-4 flex gap-4 relative shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
    >
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-lg text-[#1a1a1a] group-hover:text-[#C6A45C] transition-colors">
            {item.name}
          </h3>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed line-clamp-2 italic font-light">
            {item.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-[#1a1a1a] tracking-wider text-sm">
            ₹{item.basePrice}
          </span>
        </div>
      </div>

      <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 overflow-hidden">
        <img
          src={item.images?.[0] || "https://placehold.co/200"}
          className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
          alt={item.name}
        />

        {/* Luxury Add Button */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[80%]">
          {!cartItem ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => addItem(item)}
              className="w-full bg-[#1a1a1a] text-white py-2 text-[10px] font-bold tracking-widest shadow-lg flex items-center justify-center gap-1"
            >
              ADD <Plus size={10} />
            </motion.button>
          ) : (
            <div className="w-full bg-white border border-[#1a1a1a] flex items-center justify-between shadow-lg">
              <button
                onClick={() => decreaseQty(item._id)}
                className="p-2 hover:bg-gray-50 transition"
              >
                <Minus size={12} />
              </button>
              <span className="text-xs font-bold text-[#1a1a1a]">
                {cartItem.qty}
              </span>
              <button
                onClick={() => increaseQty(item._id)}
                className="p-2 hover:bg-gray-50 transition"
              >
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StickyCart({ navigate }) {
  const items = useCartStore((s) => s.items);
  const totalItems = items.reduce((a, b) => a + b.qty, 0);
  const totalPrice = items.reduce((a, b) => a + b.qty * b.basePrice, 0);

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-50"
        >
          <div className="bg-[#1a1a1a] text-white px-6 py-4 rounded-none flex justify-between items-center shadow-2xl border-b-4 border-[#C6A45C]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag size={20} className="text-[#C6A45C]" />
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-bold">
                  Total Bill
                </p>
                <p className="text-sm font-bold tracking-widest">
                  ₹{totalPrice.toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="flex items-center gap-2 text-[#C6A45C] text-[11px] font-bold tracking-[0.2em] uppercase hover:gap-3 transition-all"
            >
              View Cart <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
