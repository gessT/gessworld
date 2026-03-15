import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { trpc, getQueryClient } from "@/trpc/server";
import { NewTripView } from "@/modules/discover/ui/views/new-trip-view";

export const dynamic = "force-dynamic";

const page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.city.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="p-8">Loading…</div>}>
        <NewTripView />
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;
