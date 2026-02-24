import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import DishCard from "../../components/cards/DishCard";
import DiningVenueCard from "../../components/cards/DiningVenueCard";
import { diningVenues } from "./dining.data";

export default function DiningSections() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await axiosClient.get("/menu");
      setData(res.data.data || []);
    };
    fetchMenu();
  }, []);

  return (
    <>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {data.map((dish, i) => (
              <DishCard key={dish._id} dish={dish} index={i} />
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
