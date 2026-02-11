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
    <main className="min-h-screen bg-[#F5F5F0]">
      <RoomsHero />

      <section className="sticky top-0 z-50 bg-[#F5F5F0]/80 backdrop-blur border-b border-[#D4AF37]/20 py-6">
        <RoomCategoryFilter
          categories={categories}
          active={filter}
          onChange={setFilter}
        />
      </section>

      <section className="container mx-auto py-24 px-6">
        <RoomsGrid rooms={filteredRooms} />
      </section>
    </main>
  );
}
