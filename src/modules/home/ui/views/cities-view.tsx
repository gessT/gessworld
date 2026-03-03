"use client";

import CityCard from "../components/city-card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import Link from "next/link";

export const CitiesView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.home.getCitySets.queryOptions({ limit: 12 })
  );

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-red-500 rounded-full" />
            <h2 className="text-3xl md:text-4xl font-bold">Popular Destinations</h2>
          </div>
          <p className="text-muted-foreground text-base ml-3">Explore stunning cities from around the globe</p>
        </div>
        <Link href="/travel" className="hidden md:flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-semibold transition-colors">
          View All
          <MapPin className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Grid Skeleton */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="w-full h-72 rounded-2xl overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
