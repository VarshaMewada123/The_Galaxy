import { Link } from "react-router-dom";

export default function RoomsGrid({ rooms }) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 font-serif italic">
          No suites found in this category.
        </p>
      </div>
    );
  }

  return (
<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="group bg-white shadow-sm hover:shadow-2xl transition-all duration-700 overflow-hidden"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
            />

            <span className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-[9px] font-bold tracking-[0.2em] text-gray-800 uppercase shadow-sm">
              {room.size || "40 SQM"}
            </span>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-xl text-gray-800 group-hover:text-[#C6A45C] transition-colors duration-300">
                {room.name}
              </h3>
              <p className="text-[#C6A45C] font-bold tracking-tight">
                ₹{room.price?.toLocaleString()}
              </p>
            </div>

            <p className="text-gray-500 text-xs mb-8 line-clamp-2 leading-relaxed font-light">
              {room.description}
            </p>

            <Link
              to={`/room/${room.id}`}
              className="inline-block text-[10px] font-bold tracking-[0.3em] text-gray-900 border-b border-[#C6A45C] pb-1 hover:text-[#C6A45C] transition-all duration-300 uppercase"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
