import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const heroImages = [
  "/images/hero/hero-1",
  "/images/hero/hero-2",
  "/images/hero/hero-3",
];

function HeroSlider() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Luxury hotel hero section"
      className="relative h-[80vh] lg:h-screen w-full overflow-hidden"
    >
      <Swiper
        modules={[EffectFade, Autoplay, Pagination, Navigation]}
        effect="fade"
        speed={1200}
        autoplay={{
          delay: 5000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {heroImages.map((src, i) => (
          <SwiperSlide key={i}>
            {({ isActive }) => (
              <div className="relative h-full w-full">
                <motion.img
                  src={src}
                  alt="Luxury hotel interior"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  initial={reduceMotion ? false : { scale: 1.1 }}
                  animate={
                    isActive && !reduceMotion
                      ? { scale: 1 }
                      : { scale: 1.1 }
                  }
                  transition={{ duration: 6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Hero Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-4xl md:text-7xl lg:text-8xl font-serif text-white font-light"
        >
          Where Comfort Meets <br />
          <span className="text-[#C6A45C] italic">Elegance</span>
        </motion.h1>
      </div>
    </section>
  );
}

export default memo(HeroSlider);
