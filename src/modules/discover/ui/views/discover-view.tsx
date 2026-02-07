"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const DiscoverLoading = () => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <div className="relative h-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">Map feature removed</p>
        </div>
      </div>
    </div>
  );
};

export const DiscoverView = () => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <div className="h-full rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Map feature has been disabled</p>
      </div>
    </div>
  );
};
