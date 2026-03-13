"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { CityCard } from "../components/city-card";
import { AddCityDialog } from "../components/add-city-dialog";
import { MapPin, Plus, AlertCircle, LayoutGrid } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

export function CityListView() {
  const trpc = useTRPC();
  const { data: cities } = useSuspenseQuery(trpc.city.getMany.queryOptions());
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-10">
      {/* 簡約計數顯示 */}
      <div className="flex items-center gap-3 border-l-2 border-indigo-500 pl-4">
        <p className="text-white/60 text-[10px] md:text-xs uppercase tracking-[0.3em] font-black">
          Collections <span className="mx-2 text-white/10">/</span> 
          <span className="text-white">{cities.length} 個收藏城市</span>
        </p>
      </div>

      {/* 數據展示區 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        
        {/* 【新增城市】的正方形格子 */}
        <button
          onClick={() => setDialogOpen(true)}
          className="group relative aspect-square w-full overflow-hidden rounded-[2rem] border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all duration-500 flex flex-col items-center justify-center gap-3"
        >
          {/* 懸浮背景裝飾 */}
          <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-500 group-hover:scale-110 shadow-xl group-hover:shadow-indigo-500/20">
            <Plus className="w-6 h-6 text-white transition-transform group-hover:rotate-90" />
          </div>
          
          <div className="relative flex flex-col items-center">
            <span className="text-[11px] font-black text-white/40 group-hover:text-white uppercase tracking-[0.2em] transition-colors">
              新增城市
            </span>
            <span className="text-[9px] text-white/20 font-medium tracking-tighter mt-0.5">Add New Place</span>
          </div>
        </button>

        {/* 城市數據格子 */}
        {cities.map((citySet) => (
          <div 
            key={citySet.id} 
            className="aspect-square w-full relative group rounded-[2rem] overflow-hidden bg-white/5 shadow-2xl transition-all duration-500 hover:-translate-y-1"
          >
            <CityCard citySet={citySet} />
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