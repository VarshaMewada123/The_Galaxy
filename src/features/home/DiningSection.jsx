import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function DiningSection() {
  return (
    <section className="py-24 bg-[#fafaf9] overflow-hidden border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            <span className="text-[#C6A45C] tracking-[0.3em] uppercase text-xs font-bold mb-4 block">
              Culinary Excellence
            </span>

            <h2 className="text-4xl md:text-6xl font-serif mb-6 text-[#1c1c1c]">
              Taste the <br />
              <span className="italic text-[#C6A45C]">Extraordinary</span>
            </h2>

            <p className="text-gray-500 text-lg leading-relaxed mb-8 font-light">
              Indulge in a symphony of flavors crafted by our Michelin-starred
              chefs. From intimate candle-lit dinners at{" "}
              <i>The Golden Pavilion</i> to breathtaking rooftop cocktails,
              every meal is a masterpiece waiting to be savored.
            </p>

                      <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/dining"
              className="inline-block bg-[#C6A45C] hover:bg-transparent hover:border-2 hover:border-[#C6A45C] text-white hover:text-[#C6A45C] px-12 py-6 transition-all duration-500 font-bold tracking-widest text-sm uppercase rounded-full"
            >
              EXPLORE DINING & MENUS
            </Link>
          </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative z-10 aspect-[4/3] overflow-hidden rounded-sm">
              <img
                src="public/images/d.png"
                alt="Fine Dining"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-[2s]"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#C6A45C]/30 -z-0 rounded-sm" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
