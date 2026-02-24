import { motion, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";
import { heroImages } from "./homeData";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
    },
  };

  const imageVariants = {
    active: { scale: 1 },
    inactive: { scale: shouldReduceMotion ? 1 : 1.15 },
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[500px] lg:h-screen overflow-hidden bg-[#F5F5F0]">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        effect="fade"
        speed={2000}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        navigation={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={true}
        className="h-full w-full hero-swiper"
      >
        {heroImages.map((src, i) => (
          <SwiperSlide key={i} className="overflow-hidden">
            {({ isActive }) => (
              <div className="relative w-full h-full">
                <motion.img
                  src={src}
                  alt={`Luxury Ambience ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 w-full h-full object-cover"
                  variants={imageVariants}
                  initial="inactive"
                  animate={isActive ? "active" : "inactive"}
                  transition={{ duration: 7, ease: "linear" }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#F5F5F0]/20" />
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

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F5F5F0] to-transparent z-20" />
    </section>
  );
}
