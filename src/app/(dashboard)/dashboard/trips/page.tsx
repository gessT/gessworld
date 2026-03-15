import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { trpc, getQueryClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";

import { loadTripsSearchParams } from "@/modules/discover/params";
import { TripsListHeader } from "@/modules/discover/ui/components/trips-list-header";
import {
  DashboardTripsView,
  ErrorStatus,
  LoadingStatus,
} from "@/modules/discover/ui/views/dashboard-trips-view";

export const metadata = {
  title: "Trips",
  description: "Manage photography trips",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<SearchParams>;
};

const page = async ({ searchParams }: Props) => {
  const filters = await loadTripsSearchParams(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.discover.getMany.queryOptions({ ...filters })
  );

  return (
    <>
      <TripsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<LoadingStatus />}>
          <ErrorBoundary fallback={<ErrorStatus />}>
            <DashboardTripsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
};

export default page;
