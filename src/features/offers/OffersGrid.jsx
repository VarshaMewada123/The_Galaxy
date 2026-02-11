import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OfferCard from "@/components/cards/OfferCard";

export default function OffersGrid({ offers }) {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence>
          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <OfferCard offer={offer} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
