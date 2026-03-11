import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";

export default function FloatingCartBar() {
  const navigate = useNavigate();
  const cart = useCartStore((s) => s.cart);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        exit={{ y: 100, x: "-50%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-8 left-1/2 z-50 w-[94%] max-w-[550px]"
      >
        <div
          onClick={() => navigate("/checkout")}
          className="group cursor-pointer overflow-hidden rounded-2xl bg-[#C6A45C] p-0.5 shadow-[0_20px_40px_rgba(198,164,92,0.35)] transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center justify-between bg-[#C6A45C] px-6 py-4">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="rounded-full bg-[#F9F9F7]/10 p-2">
                  <ShoppingBag
                    className="h-6 w-6 text-[#F9F9F7]"
                    strokeWidth={2}
                  />
                </div>
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F9F9F7] text-[11px] font-bold text-[#C6A45C] shadow-md">
                  {totalItems}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#F9F9F7]/80">
                  Total Payable
                </span>
                <span className="text-xl font-black text-[#F9F9F7] tabular-nums leading-none">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#F9F9F7] px-5 py-2.5 transition-all group-hover:bg-[#F9F9F7]/90 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C6A45C]">
                View Cart
              </span>
              <ChevronRight
                className="h-4 w-4 text-[#C6A45C]"
                strokeWidth={3}
              />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/20" />
      </motion.div>
    </AnimatePresence>
  );
}
