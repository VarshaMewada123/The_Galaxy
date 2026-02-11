import { motion } from "framer-motion";

const experiences = [
  { title: "Infinity Pool", desc: "Roof-top swimming with sunset views" },
  { title: "Royal Spa", desc: "Authentic ayurvedic treatments" },
  { title: "Fine Dining", desc: "Michelin star chefs at your service" },
  { title: "Gym & Yoga", desc: "State of the art fitness center" },
];

export default function ExperienceSection() {
  return (
    <section className="py-32 bg-[#111] text-white overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="relative z-10 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070"
              alt="Spa"
              className="w-full hover:scale-105 transition-transform duration-[3s]"
            />
          </div>
          <div className="absolute -top-6 -left-6 w-full h-full border border-[#C6A45C]/30 -z-0" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-[#C6A45C] tracking-[0.4em] uppercase text-xs mb-6 block font-bold">
            The Rivora Experience
          </span>

          <h2 className="text-5xl md:text-6xl font-serif mb-12 leading-tight">
            Art of Living <br /> Well
          </h2>

          <div className="grid sm:grid-cols-2 gap-10">
            {experiences.map((item, i) => (
              <div key={i} className="group">
                <h4 className="text-[#C6A45C] font-serif text-2xl mb-3 group-hover:translate-x-2 transition">
                  {item.title}
                </h4>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
