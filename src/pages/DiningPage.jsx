import { motion } from "framer-motion";
import DiningSections from "../features/dining/DiningSections";

export default function DiningPage() {
  return (
    <main className="min-h-screen bg-[#fafaf9] text-[#1c1c1c] overflow-x-hidden">
      <section className="relative h-[80vh] w-full overflow-hidden">
        <motion.img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[#C6A45C] uppercase font-bold mb-4 text-sm">
            Culinary Excellence
          </span>
          <h1 className="text-6xl md:text-8xl font-serif text-white">
            The Art of <span className="italic text-[#C6A45C]">Flavour</span>
          </h1>
        </div>
      </section>

      <DiningSections />
    </main>
  );
}
