import React from "react";
import { Wifi, Dumbbell, Car, Coffee, Waves, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const AMENITIES = [
  {
    icon: Wifi,
    title: "High-Speed Connectivity",
    description:
      "Seamless fiber-optic internet accessible throughout the entire estate.",
  },
  {
    icon: Dumbbell,
    title: "Wellness Center",
    description:
      "State-of-the-art equipment designed for professional-grade training.",
  },
  {
    icon: Waves,
    title: "Infinity Pool",
    description:
      "Temperature-controlled waters with panoramic views of the horizon.",
  },
  {
    icon: Coffee,
    title: "Artisanal Dining",
    description:
      "A curated culinary journey prepared by our award-winning chefs.",
  },
  {
    icon: Car,
    title: "Valet Parking",
    description: "Secure, underground parking with 24/7 valet and EV charging.",
  },
  {
    icon: ShieldCheck,
    title: "Private Security",
    description:
      "Discrete, professional surveillance ensuring absolute peace of mind.",
  },
];

const AmenityCard = ({ item, index }) => {
  const shouldReduceMotion = useReducedMotion();
  const Icon = item.icon;
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.21, 0.45, 0.32, 0.9],
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, borderColor: "#C6A45C" }}
      className="group relative flex flex-col h-full p-8 bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-[0_20px_40px_rgba(198,164,92,0.08)]"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#C6A45C]/10 mb-6 group-hover:bg-[#C6A45C] transition-colors duration-500">
        <Icon
          className="text-[#C6A45C] group-hover:text-white transition-colors duration-500"
          strokeWidth={1.5}
          size={28}
        />
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
          {item.title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base lg:text-sm xl:text-base">
          {item.description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#C6A45C] transition-all duration-500 group-hover:w-full rounded-b-2xl" />
    </motion.div>
  );
};

export default function AmenitiesSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#FAF9F6] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1400px] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C6A45C]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C6A45C]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[#C6A45C] font-semibold tracking-[0.2em] uppercase text-xs mb-4"
          >
            Refined Living
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-gray-900 leading-[1.1]"
          >
            Premium <span className="italic text-gray-800">Amenities</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-gray-500 max-w-xl leading-relaxed"
          >
            Every detail is meticulously crafted to provide an unparalleled
            lifestyle of convenience, health, and leisure.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {AMENITIES.map((item, index) => (
            <AmenityCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
