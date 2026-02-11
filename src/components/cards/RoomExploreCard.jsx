import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function RoomExploreCard({ room }) {
  return (
    <motion.div
      layout
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex flex-col"
    >
      <div className="relative h-[500px] overflow-hidden shadow-lg">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
        />
        <div className="absolute top-6 right-6 bg-white/95 px-6 py-3">
          <p className="text-xs uppercase text-gray-500">Nightly</p>
          <p className="text-xl font-serif text-[#D4AF37]">
            ₹{room.price.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="pt-8 px-2">
        <span className="text-xs uppercase tracking-widest text-[#D4AF37]">
          {room.category}
        </span>

        <Link to={`/room/${room.id}`}>
          <h3 className="text-3xl font-serif mt-2 hover:text-[#D4AF37] transition">
            {room.name}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm mt-4 line-clamp-2">
          {room.description}
        </p>

        <Link
          to={`/room/${room.id}`}
          className="block mt-6 border border-black py-3 text-center text-xs tracking-widest hover:bg-black hover:text-white transition"
        >
          VIEW DETAILS
        </Link>
      </div>
    </motion.div>
  );
}
