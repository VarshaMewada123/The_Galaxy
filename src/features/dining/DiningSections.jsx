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

  const fetchData = async () => {
    setLoading(true);

    try {
      const [menuRes, catRes, comboRes, offerRes] = await Promise.all([
        axiosClient.get("/menu"),
        axiosClient.get("/categories"),
        axiosClient.get("/dining/combos"),
        axiosClient.get("/dining/offers"),
      ]);

      const menuData = menuRes.data.data || [];
      const catData = catRes.data.data || [];

      setMenuItems(menuData);

      const hasJainItems = menuData.some((item) => item.isJain === true);

      if (hasJainItems) {
        catData.unshift({
          _id: "jain-category",
          name: "Jain",
          image: {
            url: jainFood,
          },
          isVirtual: true,
        });
      }

      setCategories(catData);

      setCombos(comboRes?.data?.data || []);
      setOffers(offerRes?.data?.data || []);
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

    console.log("All Menu Items:", items);
    console.log("Search Query:", query);
    console.log("Active Category:", activeCategory);

    if (query.length > 0) {
      const regex = new RegExp(query, "i");

      items = items.filter((item) => {
        const nameMatch = regex.test(item.name || "");
        const categoryMatch = regex.test(item.category?.name || "");
        const jainMatch = query.includes("jain") && item.isJain === true;

        console.log("Checking Item:", item.name);
        console.log("Name Match:", nameMatch);
        console.log("Category Match:", categoryMatch);
        console.log("Jain Match:", jainMatch);

        return nameMatch || categoryMatch || jainMatch;
      });

      console.log("Filtered Items After Search:", items);
      return items;
    }

    if (activeCategory?.toLowerCase() === "jain") {
      items = items.filter((item) => item.isJain === true);
      console.log("Filtered Jain Category Items:", items);
    } else if (activeCategory !== "All") {
      items = items.filter(
        (item) =>
          item.category?.name?.toLowerCase() === activeCategory.toLowerCase(),
      );
      console.log("Filtered Category Items:", items);
    }

    console.log("Final Filtered Items:", items);
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

            <div className="hidden md:flex gap-4">
              <button
                onClick={() => scroll("left")}
                className="p-3 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all duration-300 cursor-pointer disabled:opacity-30"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-3 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
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

          <nav
            ref={scrollRef}
            className="flex gap-4 md:gap-8 lg:gap-12 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth pb-4 px-2"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
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

      <section className="py-12 md:py-20">
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
                  className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10"
                >
                  {filteredItems.map((dish) => (
                    <motion.div
                      key={dish._id}
                      variants={itemVars}
                      layout
                      className="h-full"
                    >
                      <DishCard dish={dish} />
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
              className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                    <DishCard dish={comboDish} />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}
      {/* {offers.length > 0 && (
        <section className="py-12 bg-white border-b border-gray-100">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold border-l-4 border-[#C6A45C] pl-4 mb-10">
              Best Offers For You
            </h2>

            <div className="space-y-16">
              {offers.map((offer) => (
                <div key={offer._id} className="space-y-6">
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={offer.image?.url}
                      alt={offer.name}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-white">
                      <h3 className="text-xl md:text-2xl font-bold">
                        {offer.name}
                      </h3>

                      <p className="text-sm opacity-90">
                        {offer.discountType === "PERCENTAGE"
                          ? `${offer.discountValue}% OFF`
                          : `₹${offer.discountValue} OFF`}
                      </p>
                    </div>
                  </div>

                  {offer.items?.length > 0 && (
                    <motion.div
                      variants={containerVars}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                            <DishCard dish={offerDish} />
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
      )} */}

      {/* --- Offers Section Optimized --- */}
{offers.length > 0 && (
  <section className="py-20 bg-[#FDFCFB]"> {/* Soft warm background */}
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col items-center mb-16 text-center">
        <span className="text-[#C6A45C] font-bold tracking-[0.3em] uppercase text-xs mb-3">
          Exclusive Rewards
        </span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#1A1A1A]">
          Best Offers For You
        </h2>
        <div className="w-24 h-1 bg-[#C6A45C] mt-6 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-20">
        {offers.map((offer) => (
          <div key={offer._id} className="group">
            {/* Banner Style Offer Header */}
            <div className="relative h-[250px] md:h-[350px] rounded-[2rem] overflow-hidden shadow-2xl mb-12">
              <img
                src={offer.image?.url}
                alt={offer.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-[#C6A45C]/20 flex flex-col items-center justify-center">
                <span className="text-[#C6A45C] text-xs font-bold uppercase tracking-widest">Limited Time</span>
                <span className="text-2xl font-serif font-black text-[#1A1A1A]">
                  {offer.discountType === "PERCENTAGE"
                    ? `${offer.discountValue}% OFF`
                    : `₹${offer.discountValue} OFF`}
                </span>
              </div>
              
              {/* Gradient Overlay (Lighter) */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
              
              {/* Offer Info Floating at Bottom */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[1.5rem] border border-white inline-block shadow-lg">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1A1A1A]">
                    {offer.name}
                  </h3>
                  <p className="text-gray-600 mt-2 max-w-md italic">
                    Experience the finest flavors with our exclusive seasonal discount.
                  </p>
                </div>
              </div>
            </div>

            {/* Applicable Dishes Grid */}
            {offer.items?.length > 0 && (
              <div className="relative px-4">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-[1px] flex-1 bg-gray-200" />
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-[0.2em]">Available Dishes</span>
                  <div className="h-[1px] flex-1 bg-gray-200" />
                </div>
                
                <motion.div
                  variants={containerVars}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
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
                      <motion.div key={item._id} variants={itemVars} className="hover:translate-y-[-8px] transition-transform duration-300">
                        <DishCard dish={offerDish} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
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
