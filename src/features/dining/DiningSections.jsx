import { motion } from "framer-motion";
import { diningVenues, signatureDishes } from "./dining.data";
import DishCard from "../../components/cards/DishCard";
import DiningVenueCard from "../../components/cards/DiningVenueCard";

export default function DiningSections() {
  return (
    <>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {signatureDishes.map((dish, i) => (
              <DishCard key={dish.id} dish={dish} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#111] text-white">
        <div className="container mx-auto px-4">
          {diningVenues.map((venue, i) => (
            <DiningVenueCard
              key={venue.id}
              venue={venue}
              reverse={i % 2 !== 0}
            />
          ))}
        </div>
      </section>
    </>
  );
}


