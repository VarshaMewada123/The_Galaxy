import { Link } from "react-router-dom";
import { rooms } from "./homeData";

export default function RoomsSection() {
  return (
    <section className="py-24 container mx-auto px-4">
      <h2 className="text-3xl md:text-5xl font-serif text-center mb-16">
        Our Signature Suites
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white shadow-md hover:shadow-2xl transition"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover hover:scale-110 transition duration-[2s]"
              />
              <span className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-[10px] font-bold">
                {room.size}
              </span>
            </div>

            <div className="p-6">
              <div className="flex justify-between mb-3">
                <h3 className="font-serif">{room.name}</h3>
                <p className="text-[#C6A45C] font-bold">
                  ₹{room.price.toLocaleString()}
                </p>
              </div>

              <p className="text-gray-500 text-xs mb-6 line-clamp-2">
                {room.description}
              </p>

              <Link
                to={`/room/${room.id}`}
                className="text-[10px] font-bold tracking-widest border-b-2 border-[#C6A45C]"
              >
                VIEW DETAILS
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
