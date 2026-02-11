import { motion, useReducedMotion } from "framer-motion";
import { memo } from "react";

function RoomsHero() {
  const reduceMotion = useReducedMotion();

  return (
    <header
      aria-label="Rooms hero section"
      className="relative h-[85vh] w-full overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/rooms-fallback.jpg')" }}
      />

      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/images/rooms-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/rooms-hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-white uppercase tracking-[0.4em] text-sm mb-6 block">
            The Collection
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-8">
            Sanctuaries of <span className="italic text-[#D4AF37]">Peace</span>
          </h1>

          <p className="text-white/80 max-w-xl mx-auto text-lg">
            Discover a blend of modern elegance and timeless tradition in our
            meticulously designed accommodations.
          </p>
        </motion.div>
      </div>
    </header>
  );
}

export default memo(RoomsHero);
