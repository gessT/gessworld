"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { CityCard } from "../components/city-card";
import { AddCityDialog } from "../components/add-city-dialog";
import { MapPin, Plus, AlertCircle, LayoutGrid } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
export function CityListView() {
  const trpc = useTRPC();
  const { data: cities } = useSuspenseQuery(trpc.city.getMany.queryOptions());
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="space-y-10">
      {/* 簡約計數顯示 */}
      <div className="flex items-center gap-3 border-l-2 border-indigo-500 pl-4">
        <p className="text-white/60 text-[10px] md:text-xs uppercase tracking-[0.3em] font-black">
          Collections <span className="mx-2 text-white/10">/</span> 
          <span className="text-white">{cities.length} 個收藏城市</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {/* 新增城市按鈕 (保持一致的正方形) */}
        <button
          onClick={() => setDialogOpen(true)}
          className="group relative aspect-square w-full overflow-hidden rounded-[2rem] border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all duration-500 flex flex-col items-center justify-center gap-3"
        >
          <div className="relative w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-500 shadow-xl">
            <Plus className="w-6 h-6 text-white transition-transform group-hover:rotate-90" />
          </div>
          <div className="text-center">
            <span className="block text-[11px] font-black text-white/40 group-hover:text-white uppercase tracking-[0.2em]">新增城市</span>
            <span className="block text-[9px] text-white/20 font-medium mt-0.5">Add New</span>
          </div>
        </button>

        {/* 城市數據格子 */}
        {cities.map((citySet) => (
          <div 
            key={citySet.id} 
            className="group relative aspect-square w-full rounded-[2rem] overflow-hidden bg-[#1a1a1a] shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-indigo-500/10 cursor-pointer"
            onClick={() => router.push(`/dashboard/cities/${encodeURIComponent(citySet.city)}`)}
          >
            {/* 1. 城市背景圖/內容 (CityCard 內部應填滿容器) */}
            <CityCard citySet={citySet} />

            {/* 2. 現代感文字遮罩層 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* 3. 城市資訊佈局 */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-[2px] bg-indigo-500 rounded-full" />
                  <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">
                    {citySet.country || "Explore"}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                  {citySet.country}
                </h3>
                {/* 額外資訊：例如景點數量 */}
                <div className="overflow-hidden h-0 group-hover:h-5 transition-all duration-500">
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.1em] mt-1">
                    {citySet.city}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. 裝飾性邊框 (懸停時顯現) */}
            <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-[2rem] transition-colors pointer-events-none" />
          </div>
        ))}
      </div>

      <AddCityDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

// Loading 狀態同步更新
export function CityListLoadingView() {
  return (
    <div className="space-y-10">
      <div className="h-4 w-48 bg-white/5 rounded-full animate-pulse pl-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-square w-full rounded-[2rem] bg-white/[0.03] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// Error 狀態
export function CityListErrorView() {
  return (
    <div className="flex flex-col items-center justify-center py-40 text-center border border-white/5 rounded-[2.5rem] bg-red-500/5">
      <AlertCircle className="h-8 w-8 text-red-500/30 mb-4" />
      <p className="text-white/40 text-xs font-black tracking-widest uppercase">載入失敗，請重新嘗試</p>
    </div>
  );
}