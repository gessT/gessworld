import type { Metadata } from "next";
import { Suspense } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { trpc, getQueryClient } from "@/trpc/server";
import {
  DiscoverTripsView,
  DiscoverTripsViewSkeleton,
} from "@/modules/discover/ui/views/discover-trips-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "探索旅程 · Jiotriplah",
  description:
    "以輕量的方式出走，走進下一條路線。每趟旅程都圍繞拍攝節奏與冒險精神，找到屬於你的下一站。",
};

export default async function DiscoverPage() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.discover.getManyTrips.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<DiscoverTripsViewSkeleton />}>
        <DiscoverTripsView />
      </Suspense>
    </HydrationBoundary>
  );
}
