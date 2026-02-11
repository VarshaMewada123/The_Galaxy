import { Link } from "react-router-dom";

export default function RoomCard({ room }) {
  return (
    <div className="bg-white group overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
        />
        <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 text-[10px] font-bold tracking-widest">
          {room.size}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between mb-3">
          <h3 className="text-lg font-serif">{room.name}</h3>
          <p className="text-[#C6A45C] font-bold text-sm">
            ₹{room.price.toLocaleString()}
          </p>
        </div>

        <p className="text-gray-500 text-xs mb-6 line-clamp-2">
          {room.description}
        </p>

        <Link
          to={`/room/${room.id}`}
          className="text-[10px] font-bold tracking-[0.2em] border-b-2 border-[#C6A45C]"
        >
          VIEW DETAILS
        </Link>
      </div>
    </div>
  );
}
