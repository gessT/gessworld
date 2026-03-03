import { Suspense } from "react";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import ProfileCard from "@/modules/home/ui/components/profile-card";
import Footer from "@/components/footer";
import HeroScroll from "@/modules/home/ui/components/hero-scroll";

import {
  CitiesView,
  CitiesViewLoadingStatus,
} from "@/modules/home/ui/views/cities-view";
import {
  SliderViewLoadingStatus,
  SliderView,
} from "@/modules/home/ui/views/slider-view";

export const dynamic = "force-dynamic";

const page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.home.getManyLikePhotos.queryOptions({ limit: 10 })
  );
  void queryClient.prefetchQuery(
    trpc.home.getCitySets.queryOptions({ limit: 12 })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen w-full">

        {/* ── HERO: full-viewport photo + centered text ── */}
        <div className="relative w-full h-[100dvh]">

          {/* Background photo carousel */}
          <Suspense fallback={<SliderViewLoadingStatus />}>
            <ErrorBoundary fallback={<div className="w-full h-full bg-zinc-900" />}>
              <SliderView />
            </ErrorBoundary>
          </Suspense>

          {/* Multi-layer gradient overlay for readability */}
          <div className="absolute inset-0 pointer-events-none">
            {/* top vignette */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
            {/* centre darkening layer */}
            <div className="absolute inset-0 bg-black/40" />
            {/* bottom fade to page bg */}
            <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-background to-transparent" />
          </div>

          {/* ── Centred hero content ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
            {/* pill badge */}
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 tracking-wider uppercase">
              ✦ Travel &amp; Photography
            </span>

            {/* headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-none tracking-tighter drop-shadow-xl">
              Discover
              <br />
              <span className="text-red-400">the World</span>
            </h1>

            {/* sub-headline */}
            <p className="mt-5 text-base sm:text-lg md:text-xl text-white/75 max-w-lg leading-relaxed font-medium drop-shadow">
              Authentic travel photography that captures real moments and inspiring destinations.
            </p>

            {/* CTA row */}
            <div className="mt-9 flex flex-wrap gap-3 justify-center pointer-events-auto">
              <a
                href="/travel"
                className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold px-7 py-3 rounded-full text-sm shadow-lg shadow-red-500/30 transition-colors"
              >
                Explore Destinations
              </a>
              <a
                href="/blog"
                className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold px-7 py-3 rounded-full text-sm transition-colors"
              >
                Read Stories
              </a>
            </div>
          </div>

          {/* Scroll-down indicator */}
          <HeroScroll />
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 space-y-16 pb-20">

          {/* Profile + contact */}
          <ProfileCard />

          {/* Popular destinations */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1 h-7 bg-red-500 rounded-full" />
              <h2 className="text-2xl font-bold tracking-tight">Popular Destinations</h2>
            </div>
            <Suspense fallback={<CitiesViewLoadingStatus />}>
              <ErrorBoundary fallback={<p>Something went wrong</p>}>
                <CitiesView />
              </ErrorBoundary>
            </Suspense>
          </section>

        </div>

        <Footer />
      </div>
    </HydrationBoundary>
  );
};

export default page;
