import { motion } from "framer-motion";

export default function DishCard({ dish, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden aspect-square mb-6">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-xs font-bold">
          {dish.price}
        </div>
      </div>

      <p className="text-[#C6A45C] text-[10px] uppercase tracking-[0.3em] mb-2 font-bold">
        {dish.category}
      </p>

      <h3 className="text-2xl font-serif group-hover:text-[#C6A45C] transition-colors">
        {dish.name}
      </h3>
    </motion.div>
  );
}
