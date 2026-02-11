import { motion } from "framer-motion";
import useCounter from "@/hooks/useCounter";

export default function CounterStat({ end, suffix, label }) {
  const { count, ref } = useCounter(end);

  return (
    <motion.div
      ref={ref}
      className="p-8 bg-white rounded-3xl shadow-xl text-center"
    >
      <h3 className="text-5xl font-serif text-[#C6A45C]">
        {count}
        {suffix}
      </h3>
      <p className="uppercase tracking-widest text-sm text-gray-500 mt-2">
        {label}
      </p>
    </motion.div>
  );
}
