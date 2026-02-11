import AmenityBadge from "@/components/badges/AmenityBadge";
import PriceBox from "@/components/common/PriceBox";

export default function RoomDetailSections({ room }) {
  return (
    <section className="container mx-auto px-6 py-24 grid lg:grid-cols-3 gap-16">
      <div className="lg:col-span-2">
        <h1 className="text-5xl font-serif mb-6">{room.name}</h1>

        <div className="flex gap-6 text-sm text-gray-400 mb-8">
          <span>{room.size}</span>
          <span>{room.guests} Guests</span>
          <span>{room.bed}</span>
        </div>

        <p className="text-gray-600 leading-relaxed mb-12">
          {room.description}
        </p>

        <h3 className="text-2xl font-serif mb-6">Amenities</h3>
        <div className="flex flex-wrap gap-4">
          {room.amenities.map((a, i) => (
            <AmenityBadge key={i} label={a} />
          ))}
        </div>
      </div>

      <PriceBox price={room.price} />
    </section>
  );
}
