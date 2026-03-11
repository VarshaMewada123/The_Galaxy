import { motion, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination } from "swiper/modules";
import { heroImages } from "./homeData";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 },
    },
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#F5F5F0]">
      <Swiper
        modules={[EffectFade, Autoplay, Pagination]}
        effect="fade"
        speed={2500}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop={true}
        className="h-full w-full"
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
                  initial={{ scale: 1.1 }}
                  animate={{ scale: isActive ? 1 : 1.1 }}
                  transition={{ duration: 6 }}
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
        <motion.div 
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white font-light leading-tight">
            Where Comfort Meets <br />
            <span className="text-[#C6A45C] italic">Elegance</span>
          </h1>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F5F5F0] to-transparent z-20" />
    </section>
  );
}

