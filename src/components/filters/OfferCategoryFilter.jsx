import { motion } from "framer-motion";

export default function OfferCategoryFilter({ categories, active, onChange }) {
  return (
    <section className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="container mx-auto px-6 py-6 flex gap-8 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`relative text-xs md:text-sm font-bold tracking-[0.2em] uppercase ${
              active === cat ? "text-[#D4AF37]" : "text-gray-500"
            }`}
          >
            {cat}
            {active === cat && (
              <motion.div
                layoutId="activeOffer"
                className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#D4AF37]"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
