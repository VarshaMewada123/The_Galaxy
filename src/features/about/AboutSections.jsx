import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import CounterStat from "@/components/stats/CounterStat";

export default function AboutSections({ rooms, stats }) {
  return (
    <>
      <section className="py-32 bg-[#fafaf9]">
        <div className="container mx-auto grid lg:grid-cols-3 gap-12">
          {rooms.map((room) => (
            <div key={room.id}>
              <img src={room.image} alt={room.name} />
              <h3 className="text-2xl font-serif mt-4">{room.name}</h3>
              <p className="text-gray-500">{room.description}</p>
              <Link to={`/room/${room.id}`} className="text-[#C6A45C]">
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((s, i) => (
            <CounterStat key={i} {...s} />
          ))}
        </div>
      </section>
    </>
  );
}
