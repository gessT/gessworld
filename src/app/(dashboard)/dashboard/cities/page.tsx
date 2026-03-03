import { Suspense } from "react";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import {
  CityListView,
  CityListLoadingView,
  CityListErrorView,
} from "@/modules/cities/ui/views/city-list-view";
import { MapPin } from "lucide-react";

export const metadata = {
  title: "City Collection",
  description: "City Collection",
};

export const dynamic = "force-dynamic";

const CityPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.city.getMany.queryOptions());

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Page header */}
      <div className="px-4 md:px-8 py-8 border-b border-white/8 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MapPin className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-1 h-5 bg-red-500 rounded-full" />
              <span className="text-white/40 text-xs uppercase tracking-widest font-bold">Dashboard</span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white leading-none">
              City Collection
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Your travel destinations, organized by city
            </p>
          </div>
        </div>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary FallbackComponent={CityListErrorView}>
          <Suspense fallback={<CityListLoadingView />}>
            <CityListView />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </div>
  );
};

export default CityPage;
