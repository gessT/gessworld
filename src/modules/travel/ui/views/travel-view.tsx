"use client";

import { useState } from "react";
import Footer from "@/components/footer";
import { CoverPhoto } from "../components/cover-photo";
import { CityItem } from "../components/city-item";
import { CitySetWithPhotos } from "@/db/schema";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";

export const TravelView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.travel.getCitySets.queryOptions());

  const [activeCity, setActiveCity] = useState<CitySetWithPhotos | null>(null);

  const active = activeCity ?? data[0];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#0e0e0e]">
      {/* LEFT — Cinematic full-screen photo panel */}
      <CoverPhoto citySet={active} citySets={data} />

      {/* Spacer for fixed left panel */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT — Dark editorial destination list */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen bg-[#0e0e0e]">
        {/* Header */}
        <div className="sticky top-16 z-20 bg-[#0e0e0e]/95 backdrop-blur-sm border-b border-white/8 px-8 py-6">
          <div className="flex items-center gap-2 text-red-500 text-[11px] font-bold tracking-[0.25em] uppercase mb-2">
            <MapPin className="w-3 h-3" />
            {data.length} 個目的地
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white leading-none">
            下一站{" "}
            <span className="text-white/25">去哪？</span>
          </h1>
        </div>

        {/* City grid — 2 cols mobile, 3 cols desktop */}
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-3 p-4">
          {data.map((city) => (
            <CityItem
              key={city.id}
              city={city}
              activeId={active.id}
              onMouseEnter={setActiveCity}
            />
          ))}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export const LoadingStatus = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#0e0e0e]">
      {/* LEFT skeleton */}
      <div className="w-full h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT skeleton */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#0e0e0e]">
        <div className="px-8 py-6 border-b border-white/8">
          <Skeleton className="h-3 w-28 mb-3 bg-white/10" />
          <Skeleton className="h-9 w-48 bg-white/10" />
        </div>
        <div className="flex flex-col divide-y divide-white/8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-5 px-8 py-5">
              <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0 bg-white/10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32 bg-white/10" />
                <Skeleton className="h-3 w-20 bg-white/10" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
        <Footer />
      </div>
    </div>
  );
};
