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
import { Globe2, Plus } from "lucide-react";

export const metadata = {
  title: "城市清單 | 隨心所往",
  description: "紀錄你的每一場城市冒險",
};

export const dynamic = "force-dynamic";

const CityPage = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.city.getMany.queryOptions());

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500">
    

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header - 縮小標題，強調質感 */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">Discovery Mode</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            城市收藏 <span className="text-indigo-500">.</span>
          </h1>
          <p className="text-white/40 text-sm mt-2 font-medium tracking-wide">
            探索全球城市美學，整理你的專屬旅行地圖。
          </p>
        </header>

        {/* 內容區塊 - 這裡假設 CityListView 內部使用了 Grid 佈局 */}
        <main className="relative">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary FallbackComponent={CityListErrorView}>
              <Suspense fallback={<CityListLoadingView />}>
                {/* 提示：在 CityListView 內部，請確保你的卡片使用 
                   aspect-square (Tailwind class) 來達成正方形效果 
                */}
                <CityListView />
              </Suspense>
            </ErrorBoundary>
          </HydrationBoundary>
        </main>
      </div>
    </div>
  );
};

export default CityPage;