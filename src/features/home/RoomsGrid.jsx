import rooms from "./rooms.data";
import RoomCard from "../../components/cards/RoomCard";

export default function RoomsGrid() {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif mb-4">
          Our Signature Suites
        </h2>
        <div className="h-1 w-16 bg-[#C6A45C] mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}
