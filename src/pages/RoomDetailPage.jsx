import { useParams } from "react-router-dom";
import RoomGallery from "@/components/sliders/RoomGallery";
import RoomDetailSections from "@/features/rooms/RoomDetailSections";
import { ROOMS } from "@/features/rooms/rooms.data";

export default function RoomDetailPage() {
  const { id } = useParams();

  const room = ROOMS.find((r) => r.id === Number(id) || r.slug === id);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-lg">
        Room not found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      {room.images?.length && <RoomGallery images={room.images} />}
      <RoomDetailSections room={room} />
    </main>
  );
}
