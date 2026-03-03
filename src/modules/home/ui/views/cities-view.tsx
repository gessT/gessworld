"use client";

import CityCard from "../components/city-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export const CitiesView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.home.getCitySets.queryOptions({ limit: 12 })
  );

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold">Explore Destinations</h2>
        <p className="text-muted-foreground text-lg">Discover amazing cities and stunning locations from around the world</p>
      </div>

      {/* Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {data.map((item) => (
          <CityCard
            key={item.id}
            title={item.city}
            coverPhoto={item.coverPhoto}
            country={item.country}
            photoCount={item.photos?.length || 0}
          />
        ))}
      </div>
    </div>
  );
};

export const CitiesViewLoadingStatus = () => {
  return (
    <div className="w-full space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Grid Skeleton */}
      <div className="mt-3 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="w-full h-64 rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
