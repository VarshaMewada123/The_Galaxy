import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
];

export default function OffersHeroSlider() {
  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        effect="fade"
        autoplay={{ delay: 5000 }}
        navigation
        pagination={{ clickable: true }}
        className="h-full"
      >
        {HERO_IMAGES.map((img, i) => (
          <SwiperSlide key={i}>
            <motion.img
              src={img}
              alt="Offers"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6 }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white text-center px-4">
        <span className="text-[#D4AF37] tracking-[0.5em] text-sm font-bold mb-4">
          EXCLUSIVE DEALS
        </span>
        <h1 className="text-5xl md:text-8xl font-serif font-light">
          Unbeatable <span className="italic text-[#D4AF37]">Offers</span>
        </h1>
        <p className="text-xl mt-6 max-w-2xl text-white/90">
          Curated luxury experiences at exceptional prices.
        </p>
      </div>
    </section>
  );
}
