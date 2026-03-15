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
  title: "Discover �� Snaptogoclub",
  description:
    "�ø����p�ķ�ʽҎ������·�����ĳ����`�е�ð�U�L�����ҵ������һվ��",
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
