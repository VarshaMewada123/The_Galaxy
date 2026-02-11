import AboutHeroSlider from "@/components/sliders/AboutHeroSlider";
import AboutSections from "@/features/about/AboutSections";
import {
  ABOUT_ROOMS,
  ABOUT_STATS,
  ROYAL_TIMELINE,
} from "@/features/about/about.data";

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <AboutHeroSlider timeline={ROYAL_TIMELINE} />
      <AboutSections rooms={ABOUT_ROOMS} stats={ABOUT_STATS} />
    </main>
  );
}
