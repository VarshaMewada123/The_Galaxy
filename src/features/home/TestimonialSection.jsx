import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import { testimonials } from "./homeData";

import "swiper/css";
import "swiper/css/effect-fade";

export default function TestimonialSection() {
  return (
    <section className="py-32 bg-white relative">
      <div className="container mx-auto px-4 text-center">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 4000 }}
          className="max-w-4xl mx-auto"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <p className="text-3xl md:text-4xl font-serif italic text-gray-800 mb-12">
                  “{t.text}”
                </p>

                <div className="w-16 h-[1px] bg-[#C6A45C] mx-auto mb-6" />

                <p className="uppercase tracking-[0.4em] font-bold text-xs text-gray-400">
                  {t.author}
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
