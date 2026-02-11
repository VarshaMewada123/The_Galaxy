import { AnimatePresence, motion } from "framer-motion";
import RoomExploreCard from "@/components/cards/RoomExploreCard";

export default function RoomsGrid({ rooms = [] }) {
  if (!rooms.length) {
    return (
      <p className="text-center text-gray-400 py-20">No rooms available</p>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence>
        {rooms.map((room) => (
          <RoomExploreCard key={room.id} room={room} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
