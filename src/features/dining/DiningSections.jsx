/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Loader2,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";
import DishCard from "../../components/cards/DishCard";
import DiningVenueCard from "../../components/cards/DiningVenueCard";
import { diningVenues } from "./dining.data";
import jainFood from "@/assets/Jain.webp";

const containerVars = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVars = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

export default function DiningSections() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [combos, setCombos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [offers, setOffers] = useState([]);
  const [availability, setAvailability] = useState(null);
  const menuSectionRef = useRef(null);

  const isOrderingAllowed = () => {
    if (!availability) return false;
    if (!availability.isOrderingEnabled) return false;
    if (availability.isTemporarilyClosed) return false;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    if (
      currentTime < availability.kitchenStartTime ||
      currentTime > availability.kitchenEndTime
    ) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (menuSectionRef.current) {
      window.scrollTo({
        top: menuSectionRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  }, [activeCategory, searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes, comboRes, offerRes, availabilityRes] =
        await Promise.all([
          axiosClient.get("/menu"),
          axiosClient.get("/categories"),
          axiosClient.get("/dining/combos"),
          axiosClient.get("/dining/offers"),
          axiosClient.get("/admin/availability"),
        ]);

      const menuData = menuRes.data.data || [];
      const catData = catRes.data.data || [];

      setMenuItems(menuData);

      const hasJainItems = menuData.some((item) => item.isJain === true);

      if (hasJainItems) {
        catData.unshift({
          _id: "jain-category",
          name: "Jain",
          image: { url: jainFood },
          isVirtual: true,
        });
      }

      setCategories(catData);
      setCombos(comboRes?.data?.data || []);
      setOffers(offerRes?.data?.data || []);
      setAvailability(availabilityRes?.data?.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let items = [...menuItems];

    if (query.length > 0) {
      const regex = new RegExp(query, "i");
      return items.filter(
        (item) =>
          regex.test(item.name || "") ||
          regex.test(item.category?.name || "") ||
          (query.includes("jain") && item.isJain === true),
      );
    }

    if (activeCategory?.toLowerCase() === "jain") {
      return items.filter((item) => item.isJain === true);
    } else if (activeCategory !== "All") {
      return items.filter(
        (item) =>
          item.category?.name?.toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    return items;
  }, [menuItems, activeCategory, searchQuery]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth * 0.6 : clientWidth * 0.6;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  useEffect(() => {
    if (menuSectionRef.current) {
      window.scrollTo({
        top: menuSectionRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  }, [activeCategory, debouncedSearch]);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] selection:bg-[#C6A45C] selection:text-white py-10">
      <section className="pt-8 pb-12 bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#02060c] tracking-tight">
                What's on your mind?
              </h2>
            </div>
          </div>

          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-xl">
              <Search
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search dishes or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3 border border-gray-200 rounded-full outline-none focus:ring-2 focus:ring-[#C6A45C]"
              />
            </div>
          </div>

          <nav className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 justify-items-center pb-4 px-2">
            <CategoryCircle
              name="All"
              isActive={activeCategory === "All"}
              onClick={() => setActiveCategory("All")}
            />
            {categories.map((cat) => (
              <CategoryCircle
                key={cat._id}
                name={cat.name}
                image={cat.image?.url}
                isActive={activeCategory === cat.name}
                onClick={() => setActiveCategory(cat.name)}
              />
            ))}
          </nav>
        </div>
      </section>

      <section ref={menuSectionRef} className="py-12 md:py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="mb-10 md:mb-16">
            <h2 className="text-xl md:text-3xl font-serif font-bold italic border-l-4 border-[#C6A45C] pl-5">
              {activeCategory === "All"
                ? "Chef's Specials"
                : `Premium ${activeCategory} Selection`}
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 min-h-[400px]">
              <Loader2 className="animate-spin text-[#C6A45C] mb-4" size={48} />
              <p className="text-gray-500 font-serif italic animate-pulse">
                Curating your menu...
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filteredItems.length > 0 ? (
                <motion.div
                  key={activeCategory + searchQuery}
                  variants={containerVars}
                  initial={shouldReduceMotion ? "visible" : "hidden"}
                  animate="visible"
                  exit={{ opacity: 0, y: 10 }}
                  className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-8 lg:gap-10"
                >
                  {filteredItems.map((dish) => (
                    <motion.div
                      key={dish._id}
                      variants={itemVars}
                      layout
                      className="h-full"
                    >
                      <DishCard dish={dish} isDisabled={!isOrderingAllowed()} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32 bg-white rounded-[2rem] border border-gray-100 shadow-sm"
                >
                  <UtensilsCrossed
                    className="mx-auto text-gray-200 mb-6"
                    size={80}
                  />
                  <p className="text-gray-400 font-serif text-lg italic">
                    No items found.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {combos.length > 0 && (
        <section className="py-16 border-b border-gray-100 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold border-l-4 border-[#C6A45C] pl-4 mb-10">
              Special Combos
            </h2>

            <motion.div
              variants={containerVars}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-2"
            >
              {combos.map((combo) => {
                const comboDish = {
                  _id: combo._id,
                  name: combo.name,
                  basePrice: combo.price,
                  images: [
                    {
                      url:
                        combo?.images?.[0]?.url ||
                        combo?.items?.[0]?.item?.images?.[0]?.url,
                    },
                  ],
                  description: combo.items
                    ?.map((i) => `${i.item?.name} x${i.quantity}`)
                    .join(", "),
                  isCombo: true,
                  comboItems: combo.items,
                };

                return (
                  <motion.div key={combo._id} variants={itemVars} layout>
                    <DishCard
                      dish={comboDish}
                      isDisabled={!isOrderingAllowed()}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {offers.length > 0 && (
        <section className="py-20 bg-[#FDFCFB]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold border-l-4 border-[#C6A45C] pl-4 mb-10">
              Special Offers
            </h2>
            <div className="grid grid-cols-1 gap-20">
              {offers.map((offer) => (
                <div key={offer._id} className="group">
                  <div className="relative h-[250px] md:h-[350px] rounded-[2rem] overflow-hidden shadow-2xl mb-12">
                    <img
                      src={offer.image?.url}
                      alt={offer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {offer.items?.length > 0 && (
                    <motion.div
                      variants={containerVars}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4"
                    >
                      {offer.items.map((item) => {
                        const offerDish = {
                          ...item,
                          offer: {
                            discountType: offer.discountType,
                            discountValue: offer.discountValue,
                            endDate: offer.endDate,
                          },
                        };

                        return (
                          <motion.div key={item._id} variants={itemVars}>
                            <DishCard
                              dish={offerDish}
                              isDisabled={!isOrderingAllowed()}
                            />
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 bg-[#0A0A0A] text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-24 md:space-y-40">
          {diningVenues.map((venue, i) => (
            <DiningVenueCard
              key={venue.id}
              venue={venue}
              reverse={i % 2 !== 0}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function CategoryCircle({ name, image, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center flex-shrink-0 snap-start group outline-none focus-visible:ring-2 focus-visible:ring-[#C6A45C] rounded-xl p-1 cursor-pointer"
    >
      <div className="relative p-2 flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full border-2 border-[#C6A45C] transition-all duration-500 ${
            isActive
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0 group-hover:scale-90 group-hover:opacity-30"
          }`}
        />

        <motion.div
          whileTap={{ scale: 0.95 }}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-50 transition-all duration-300 z-10 ${
            isActive ? "shadow-xl" : "shadow-sm group-hover:shadow-lg"
          }`}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                isActive ? "scale-110" : "scale-100 group-hover:scale-110"
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[#C6A45C] font-serif text-2xl">
              {name[0]}
            </div>
          )}
        </motion.div>
      </div>

      <span
        className={`text-[10px] md:text-xs lg:text-sm font-bold tracking-[0.15em] uppercase mt-4 ${
          isActive ? "text-[#C6A45C]" : "text-gray-500 group-hover:text-black"
        }`}
      >
        {name}
      </span>
    </button>
  );
}
