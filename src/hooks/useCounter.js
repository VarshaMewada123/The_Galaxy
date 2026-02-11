import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function useCounter(end, duration = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.5 });

  useEffect(() => {
    if (!inView) return;

    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= end) {
          clearInterval(timer);
          return end;
        }
        return prev + increment;
      });
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return { count: Math.floor(count), ref };
}
