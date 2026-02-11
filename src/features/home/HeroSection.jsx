import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import { heroImages } from "./homeData";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] lg:h-screen">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        effect="fade"
        speed={2500}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        className="h-full hero-swiper"
      >
        {heroImages.map((src, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <div className="relative h-full">
                <motion.img
                  src={src}
                  alt="Luxury Hotel"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ scale: 1.2 }}
                  animate={isActive ? { scale: 1 } : { scale: 1.2 }}
                  transition={{ duration: 6 }}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-7xl lg:text-8xl font-serif text-white font-light"
        >
          Where Comfort Meets <br />
          <span className="text-[#C6A45C] italic">Elegance</span>
        </motion.h1>
      </div>
    </section>
  );
}
