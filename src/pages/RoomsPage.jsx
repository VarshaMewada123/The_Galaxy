import { useState } from "react";
import RoomsHero from "@/components/heroes/RoomsHero";
import RoomsGrid from "@/features/rooms/RoomsGrid";
import RoomCategoryFilter from "@/components/filters/RoomCategoryFilter";
import { ROOMS } from "@/features/rooms/rooms.data";
import { ROOM_CATEGORIES } from "@/features/rooms/room.constants";

export default function RoomsPage() {
  const [filter, setFilter] = useState("All");

  const roomsData = Array.isArray(ROOMS) ? ROOMS : [];
  const categories = Array.isArray(ROOM_CATEGORIES) ? ROOM_CATEGORIES : ["All"];

  const filteredRooms =
    filter === "All"
      ? roomsData
      : roomsData.filter((room) => room.category === filter);

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <RoomsHero />
      <div className="sticky top-0 z-50 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-[#C6A45C]/10 py-6">
        <RoomCategoryFilter
          categories={categories}
          active={filter}
          onChange={setFilter}
        />
      </div>

      <section className="container mx-auto py-12 md:py-20 px-3 md:px-10 lg:px-20">
        <div className="mb-10 md:mb-16 text-center">
          <span className="text-[#C6A45C] tracking-[0.2em] md:tracking-[0.4em] text-[8px] md:text-[10px] font-bold uppercase block mb-2 md:mb-3">
            Discover Comfort
          </span>
          <h2 className="text-2xl md:text-5xl font-serif text-gray-800 italic">
            {filter === "All" ? "Our Luxury Suites" : `${filter} Collection`}
          </h2>
        </div>

        <RoomsGrid rooms={filteredRooms} />
      </section>
    </main>
  );
}
