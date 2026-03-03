"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { CityCard } from "../components/city-card";
import { AddCityDialog } from "../components/add-city-dialog";
import { MapPin, Plus, AlertCircle } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function CityListView() {
  const trpc = useTRPC();
  const { data: cities } = useSuspenseQuery(trpc.city.getMany.queryOptions());
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="px-4 md:px-8">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-white/40 text-sm uppercase tracking-widest font-medium">
          {cities.length} {cities.length === 1 ? "destination" : "destinations"}
        </p>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold uppercase tracking-wide px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add City
        </button>
      </div>

      {/* Empty state */}
      {(!cities || cities.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-2xl bg-white/2">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <MapPin className="h-7 w-7 text-white/30" />
          </div>
          <h3 className="text-white font-black uppercase tracking-tight text-lg mb-1">No destinations yet</h3>
          <p className="text-white/40 text-sm mb-6 max-w-xs">
            Start building your travel collection by adding your first city album.
          </p>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold uppercase tracking-wide px-5 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add City
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cities.map((citySet) => (
            <CityCard key={citySet.id} citySet={citySet} />
          ))}
        </div>
      )}

      <AddCityDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

export function CityListLoadingView() {
  return (
    <div className="px-4 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
        <div className="h-9 w-28 bg-white/5 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-3/4 w-full rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function CityListErrorView() {
  return (
    <div className="px-4 md:px-8 flex flex-col items-center justify-center py-24 text-center border border-dashed border-red-500/20 rounded-2xl bg-red-500/3">
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-7 w-7 text-red-400" />
      </div>
      <p className="text-white font-bold uppercase tracking-tight mb-1">Failed to load cities</p>
      <p className="text-white/40 text-sm">Please try refreshing the page</p>
    </div>
  );
}
