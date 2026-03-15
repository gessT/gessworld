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
        <div className="relative isolate w-full h-[calc(100dvh-64px)]">

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
            <span className="mt-24 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white/90 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 tracking-wider uppercase">
              ✦ Travel &amp; Photography
            </span>

            {/* headline */}
            <div className="flex flex-col items-center text-center space-y-12">
              {/* 主標題：極輕量化的現代美學 */}
              <h1 className="text-5xl sm:text-7xl lg:text-9xl font-thin text-white leading-[0.9] tracking-tighter uppercase">
                Snap <span className="text-white/20 italic font-extralight">to go</span>
                <br />
                <span className="font-light tracking-[0.1em] text-red-500">Club</span>
              </h1>

              {/* 核心理念：橫向流動感 */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-[1px] bg-white/20" />
                  <p className="text-lg md:text-2xl font-light tracking-[0.5em] text-white/90 uppercase">
                    旅行 <span className="text-red-500 mx-1">×</span> 攝影 <span className="text-red-500 mx-1">×</span> 社交
                  </p>
                  <div className="w-12 h-[1px] bg-white/20" />
                </div>

                {/* 副標題：寬字距、高行高 */}
                <div className="max-w-xl space-y-2">
                  <p className="text-sm md:text-base text-white/40 leading-relaxed font-light tracking-[0.2em]">
                    每一場旅途都是一次萃取。
                  </p>
                  <p className="text-sm md:text-base text-white/40 leading-relaxed font-light tracking-[0.2em]">
                    我們一起走入風景，用鏡頭交換故事，讓瞬間成為永恆。
                  </p>
                </div>
              </div>

              {/* 裝飾性的小細節：座標感 */}
              <div className="pt-8 opacity-20 hover:opacity-100 transition-opacity duration-700">
                <p className="text-[10px] font-thin tracking-[1em] uppercase text-white">
                  Based in Malaysia x Singapore
                </p>
              </div>
            </div>

            {/* CTA row */}
            <div className="mt-9 flex flex-wrap gap-3 justify-center pointer-events-auto">
              <a
                href="/travel"
                className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium tracking-widest px-7 py-3 rounded-full text-sm shadow-lg shadow-red-500/30 transition-all duration-300"
              >
                探索目的地
              </a>

              <a
                href="/blog"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium tracking-widest px-7 py-3 rounded-full text-sm transition-all duration-300"
              >
                閱讀旅人故事
              </a>
            </div>
          </div>

          {/* Scroll-down indicator */}
          {/* <HeroScroll /> */}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 space-y-16 pb-20">

          {/* Profile + contact */}
          <ProfileCard />

          {/* Popular destinations */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1 h-7 bg-red-500 rounded-full" />
              <h2 className="text-2xl font-bold tracking-tight">人氣目的地</h2>
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
