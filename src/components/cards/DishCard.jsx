

/* eslint-disable no-unused-vars */
import { motion, useReducedMotion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useState } from "react";

export default function DishCard({ dish, index }) {
  const addItem = useCartStore((s) => s.addItem);
  const shouldReduceMotion = useReducedMotion();
  const [quantity, setQuantity] = useState(dish.quantity ?? null);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    const payload = dish.isCombo
      ? { ...dish, combo: dish._id }
      : { ...dish, menuItems: dish._id };

    addItem(payload);

    if (quantity !== null && quantity > 0) {
      setQuantity((q) => q - 1);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  const price = dish.finalPrice ?? dish.basePrice ?? dish.price;
  const originalPrice = dish.originalPrice ?? dish.basePrice ?? dish.price;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="group relative flex flex-col w-full h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden aspect-[4/3] sm:aspect-square bg-gray-50">
        <motion.img
          loading="lazy"
          src={
            dish.images?.[0]?.url ||
            "https://placehold.co/600x600?text=Delicious+Food"
          }
          alt={dish.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: shouldReduceMotion ? 1 : 1.08 }}
          transition={{ duration: 0.6 }}
        />

        {/* PRICE BADGE */}
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-sm font-bold tracking-tight flex items-center gap-2">
          ₹{price}

          {dish.savings > 0 && (
            <span className="line-through text-gray-300 text-[11px]">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* OFFER BADGE */}
        {dish.offer && (
          <div className="absolute top-3 right-3 bg-[#C6A45C] text-white px-2 py-1 rounded-md text-[10px] font-bold tracking-wide shadow">
            {dish.offer.discountType === "PERCENTAGE"
              ? `${dish.offer.discountValue}% OFF`
              : `₹${dish.offer.discountValue} OFF`}
          </div>
        )}

        {/* ADD BUTTON */}
        <div className="absolute bottom-3 right-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={quantity !== null && quantity === 0}
            className="flex items-center gap-1 bg-white border border-gray-200 shadow-lg px-4 py-2 rounded-xl text-[#C6A45C] font-black uppercase text-[12px] tracking-wider hover:bg-gray-50 transition-colors cursor-pointer group/btn disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
            <Plus
              size={14}
              className="group-hover/btn:rotate-90 transition-transform"
            />
          </motion.button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[#C6A45C] text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold truncate pr-2">
            {dish.category?.name || "Main Course"}
          </p>

          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
            <span className="text-[11px] font-bold text-green-700">
              {dish.rating || "4.2"}
            </span>
            <Star size={10} className="fill-green-700 text-green-700" />
          </div>
        </div>

        <h3 className="text-lg md:text-xl font-serif text-gray-900 group-hover:text-[#C6A45C] transition-colors leading-tight mb-2 line-clamp-2">
          {dish.name}
        </h3>

        {dish.description && (
          <p className="text-gray-500 text-xs md:text-sm line-clamp-2 mb-2 font-light">
            {dish.description}
          </p>
        )}

        {/* SAVINGS */}
        {dish.savings > 0 && (
          <p className="text-green-600 text-xs font-semibold mb-1">
            Save ₹{dish.savings}
          </p>
        )}

        {/* OFFER VALIDITY */}
        {dish.offer && (
          <p className="text-gray-400 text-[11px]">
            Valid till {new Date(dish.offer.endDate).toLocaleDateString()}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center gap-2">
          <div className="h-[1px] flex-grow bg-gray-100"></div>
        </div>
      </div>
    </motion.div>
  );
}