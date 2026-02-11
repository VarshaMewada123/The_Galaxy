import { motion } from "framer-motion";

export default function RoomCategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex justify-center gap-12">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`relative uppercase tracking-widest text-sm ${
            active === cat ? "text-black" : "text-gray-400"
          }`}
        >
          {cat}
          {active === cat && (
            <motion.div
              layoutId="activeFilter"
              className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37]"
            />
          )}
        </button>
      ))}
    </div>
  );
}
