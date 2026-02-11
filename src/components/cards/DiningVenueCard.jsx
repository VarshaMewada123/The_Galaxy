import { motion } from "framer-motion";

export default function DiningVenueCard({ venue, reverse }) {
  return (
    <div
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center gap-12 mb-24`}
    >
      <motion.img
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        src={venue.image}
        alt={venue.name}
        className="w-full md:w-1/2 aspect-[16/9] object-cover shadow-2xl"
      />

      <motion.div
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="flex-1 space-y-6"
      >
        <span className="text-[#C6A45C] tracking-[0.3em] uppercase text-xs font-bold">
          {venue.type}
        </span>
        <h3 className="text-4xl md:text-5xl font-serif">{venue.name}</h3>
        <p className="text-gray-400">{venue.description}</p>
        <button className="px-8 py-3 border border-[#C6A45C] text-[#C6A45C] text-xs font-bold tracking-widest hover:bg-[#C6A45C] hover:text-white transition">
          RESERVE A TABLE
        </button>
      </motion.div>
    </div>
  );
}
