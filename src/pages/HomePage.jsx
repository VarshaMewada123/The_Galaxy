import HeroSection from "../features/home/HeroSection";
import RoomSection from "../features/home/RoomSection";
import DiningSection from "../features/home/DiningSection";
import TestimonialSection from "../features/home/TestimonialSection";
import AmenitiesSection from "../features/home/AmenitiesSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fafaf9] overflow-x-hidden">
      <HeroSection />
      <RoomSection />
      <DiningSection />
      <AmenitiesSection />
      <TestimonialSection />
    </main>
  );
}
