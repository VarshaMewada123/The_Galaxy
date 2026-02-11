import { useState } from "react";
import OffersHeroSlider from "@/components/sliders/OffersHeroSlider";
import OfferCategoryFilter from "@/components/filters/OfferCategoryFilter";
import OffersGrid from "@/features/offers/OffersGrid";
import { OFFERS_DATA, OFFER_CATEGORIES } from "@/features/offers/offers.data";

export default function OffersPage() {
  const [active, setActive] = useState("All Offers");

  const filtered =
    active === "All Offers"
      ? OFFERS_DATA
      : OFFERS_DATA.filter((o) => o.category === active);

  return (
    <main className="min-h-screen bg-[#F5F5F0]">
      <OffersHeroSlider />
      <OfferCategoryFilter
        categories={OFFER_CATEGORIES}
        active={active}
        onChange={setActive}
      />
      <OffersGrid offers={filtered} />
    </main>
  );
}
