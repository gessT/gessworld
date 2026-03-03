import { Suspense } from "react";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import ProfileCard from "@/modules/home/ui/components/profile-card";
import LatestTravelCard from "@/modules/home/ui/components/latest-travel-card";
import Footer from "@/components/footer";

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
        {/* HERO SECTION - Full width photo slider */}
        <div className="relative w-full h-[75vh] lg:h-[85vh]">
          <Suspense fallback={<SliderViewLoadingStatus />}>
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
              <SliderView />
            </ErrorBoundary>
          </Suspense>

          {/* Hero overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background pointer-events-none" />

          {/* Hero text overlay */}
          <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none">
            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
              Discover the World
            </h1>
            <p className="mt-3 text-lg md:text-xl text-white/80 drop-shadow">
              Travel photography that tells a story
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-12 relative z-10 space-y-16 pb-16">
          {/* PROFILE CARD  */}
          <ProfileCard />

          {/* LATEST TRAVEL  */}
          <LatestTravelCard />

          {/* CITY SETS CARD  */}
          <Suspense fallback={<CitiesViewLoadingStatus />}>
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
              <CitiesView />
            </ErrorBoundary>
          </Suspense>
        </div>

        <Footer />
      </div>
    </HydrationBoundary>
  );
};

export default page;
