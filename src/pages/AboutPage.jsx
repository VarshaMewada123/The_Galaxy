import React, { Suspense, lazy } from "react";
import {
  ABOUT_ROOMS,
  ABOUT_STATS,
  ROYAL_TIMELINE,
} from "@/features/about/about.data";

const AboutHeroSlider = lazy(
  () => import("@/components/sliders/AboutHeroSlider"),
);
const AboutSections = lazy(() => import("@/features/about/AboutSections"));

const PageLoader = () => (
  <div className="w-full h-screen flex items-center justify-center bg-[#020617]">
    <div className="w-8 h-8 border-2 border-[#C6A45C] border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full bg-white overflow-x-hidden selection:bg-[#C6A45C] selection:text-white">
      <Suspense fallback={<PageLoader />}>
        <article className="flex flex-col w-full">
          <section className="relative w-full overflow-hidden">
            <AboutHeroSlider timeline={ROYAL_TIMELINE} />
          </section>

          <section className="relative w-full">
            <AboutSections rooms={ABOUT_ROOMS} stats={ABOUT_STATS} />
          </section>
        </article>
      </Suspense>
    </main>
  );
}
