// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { EffectFade, Autoplay, Pagination } from "swiper/modules";
// import { Link } from "react-router-dom";

// import "swiper/css";
// import "swiper/css/effect-fade";
// import "swiper/css/pagination";

// export default function AboutHeroSlider({ timeline = [] }) {
//   const [scrollY, setScrollY] = useState(0);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const onScroll = () => setScrollY(window.scrollY);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const activeSlide = timeline[activeIndex] || {};

//   return (
//     <section className="relative h-[90vh] md:h-screen w-full overflow-hidden">
//       <Swiper
//         modules={[EffectFade, Autoplay, Pagination]}
//         effect="fade"
//         speed={1500}
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         pagination={{ clickable: true, dynamicBullets: true }}
//         onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
//         className="h-full w-full"
//       >
//         {timeline.map((item, index) => (
//           <SwiperSlide key={index}>
//             <div className="relative h-full w-full">
//               <motion.img
//                 src={item.image}
//                 alt={item.title}
//                 className="absolute inset-0 w-full h-full object-cover"
//                 initial={{ scale: 1.15 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 8, ease: "easeOut" }}
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>

//       <div
//         className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
//         style={{ transform: `translateY(${scrollY * 0.15}px)` }} // softer parallax
//       >
//         <div className="max-w-5xl">
//           {activeSlide.year && (
//             <motion.span
//               key={activeSlide.year}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="inline-block mb-6 text-[#C6A45C] tracking-[0.4em] uppercase text-xs font-bold"
//             >
//               {activeSlide.year}
//             </motion.span>
//           )}

//           <motion.h1
//             key={activeSlide.title}
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.9 }}
//             className="text-4xl sm:text-6xl md:text-8xl font-serif text-white mb-8 leading-tight"
//           >
//             {activeSlide.title || "The Galaxy"} <br />
//             <span className="text-[#C6A45C] italic font-light">
//               Beyond Hospitality
//             </span>
//           </motion.h1>

//           <motion.p
//             key={activeSlide.description}
//             initial={{ opacity: 0, y: 25 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-12 font-light leading-relaxed"
//           >
//             {activeSlide.description ||
//               "Experience a world where every detail is crafted for your comfort."}
//           </motion.p>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//           >
//             <Link
//               to="/explore"
//               className="inline-block bg-[#C6A45C] hover:bg-transparent hover:border-2 hover:border-[#C6A45C] text-white hover:text-[#C6A45C] px-12 py-6 transition-all duration-500 font-bold tracking-widest text-sm uppercase rounded-full"
//             >
//               Explore Our World
//             </Link>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }


import { useEffect, useState, useCallback, memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

function AboutHeroSlider({ timeline = [] }) {
  const [scrollY, setScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const handleScroll = useCallback(() => {
    window.requestAnimationFrame(() => {
      setScrollY(window.scrollY);
    });
  }, []);

  useEffect(() => {
    if (!reduceMotion) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, reduceMotion]);

  const activeSlide = timeline[activeIndex] || {};

  return (
    <section
      aria-label="About timeline hero section"
      className="relative h-[90vh] md:h-screen w-full overflow-hidden"
    >
      <Swiper
        modules={[EffectFade, Autoplay, Pagination]}
        effect="fade"
        speed={1200}
        autoplay={{
          delay: 5000,
          pauseOnMouseEnter: true,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="h-full w-full"
      >
        {timeline.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <motion.img
                src={item.image}
                alt={item.title || "Luxury heritage slide"}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                initial={reduceMotion ? false : { scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content */}
      <div
        className="absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
        style={{
          transform: reduceMotion
            ? "none"
            : `translateY(${scrollY * 0.12}px)`,
        }}
      >
        <div className="max-w-5xl">
          {activeSlide.year && (
            <motion.span
              key={activeSlide.year}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6 text-[#C6A45C] tracking-[0.4em] uppercase text-xs font-bold"
            >
              {activeSlide.year}
            </motion.span>
          )}

          <motion.h1
            key={activeSlide.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-4xl sm:text-6xl md:text-8xl font-serif text-white mb-8 leading-tight"
          >
            {activeSlide.title || "The Galaxy"} <br />
            <span className="text-[#C6A45C] italic font-light">
              Beyond Hospitality
            </span>
          </motion.h1>

          <motion.p
            key={activeSlide.description}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto mb-12 font-light leading-relaxed"
          >
            {activeSlide.description ||
              "Experience a world where every detail is crafted for your comfort."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/explore"
              className="inline-block bg-[#C6A45C] hover:bg-transparent hover:border-2 hover:border-[#C6A45C] text-white hover:text-[#C6A45C] px-12 py-6 transition-all duration-500 font-bold tracking-widest text-sm uppercase rounded-full"
            >
              Explore Our World
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default memo(AboutHeroSlider);
