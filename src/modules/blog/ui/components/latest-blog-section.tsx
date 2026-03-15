"use client";

import { useMemo } from "react"; // 引入 useMemo
import Image from "next/image";
import Link from "next/link";
import { postsGetMany } from "@/modules/blog/types";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { ArrowRight, MapPin } from "lucide-react";

interface LatestPostSectionProps {
  data?: postsGetMany[0];
  compactHeader?: boolean;
}

// ── 生成的 10 句溫柔邂逅感旅行短語 (繁體中文) ──
const travelQuotes = [
  "與其說這是一場旅行，不如說是生命中一場與未知的溫柔邂逅。",
  "走進世界，只為在某個轉角，遇見那個遺失已久的自己。",
  "光影流轉間，我們用鏡頭定格的不僅是風景，更是靈魂的悸動。",
  "在陌生的城市，呼吸著未知的空氣，每一刻都是溫柔的序章。",
  "旅行的意義，是在漫長的時光裡，找尋那份最初的悸動。",
  "與世界輕輕相擁，在山海之間，寫下屬於我們的詩意篇章。",
  "每一場遠行，都是為了在更廣闊的天空下，重新定義日常。",
  "在風與海的耳語中，我們迷失，然後重新找到方向。",
  "鏡頭捕捉的瞬間，是時光溫柔的饋贈，也是靈魂的獨白。",
  "世界很大，風景很美，而最動人的，是與你一同見證的此刻。"
];

export const LatestPostSection = ({ data, compactHeader = false }: LatestPostSectionProps) => {
  
  // 使用 useMemo 確保每次渲染時隨機選擇一句短語，避免頻繁變化
  const randomQuote = useMemo(() => {
    return travelQuotes[Math.floor(Math.random() * travelQuotes.length)];
  }, [data]); // data 變化時重新生成

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#fdfaf5] rounded-3xl p-10">
        <p className="text-stone-300 text-sm font-light">
          暫無最新旅拍故事，探索世界從這裡開始
        </p>
      </div>
    );
  }

  // 地點：優先使用 data.location，否則預設一個
  const location = data.slug || "某個溫柔的角落"; // 或 data.location_cn

  return (
    <Link
      href={`/blog/${data.slug}`}
      className={`block w-full relative overflow-hidden group cursor-pointer rounded-3xl ${
        compactHeader ? "h-[48vh]" : "h-[60vh] md:h-full"
      }`}
    >
      {/* ── Background Image ── */}
      <Image
        src={keyToUrl(data.coverImage) || "/placeholder.svg"}
        alt={data.title || ""}
        fill
        unoptimized
        priority
        className="object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out-quint"
      />

      {/* ── Soft, Environmental Vignette ── */}
      {/* 漸變色變為柔和的現代暖珊瑚色調，取代強烈的 Teal */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2c1a1a]/70 via-transparent to-[#2c1a1a]/20" />

      {/* ── Editorial Block (Moiderm Travel Style) ── */}
      <div
        className={`absolute bottom-0 left-0 z-10 w-full max-w-7xl flex flex-col md:flex-row md:items-end md:justify-between ${
          compactHeader ? "p-6 sm:p-8 gap-4" : "p-10 sm:p-16 lg:p-24 gap-8"
        }`}
      >
        
        {/* Left Column: Context & Title */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-6">
            {/* 標籤背景變為淺紅/珊瑚粉 */}
            <span
              className={`bg-[#ff8a8a] text-white font-black tracking-[0.25em] uppercase rounded-full ${
                compactHeader ? "text-[9px] px-3 py-1.5" : "text-[10px] md:text-[11px] px-4 py-2"
              }`}
            >
              最新旅拍
            </span>
            {/* 地點變為動態數據 */}
            <div
              className={`flex items-center gap-2 text-white/50 font-light tracking-[0.1em] uppercase ${
                compactHeader ? "text-[10px]" : "text-[11px]"
              }`}
            >
                <MapPin className={compactHeader ? "w-2.5 h-2.5" : "w-3 h-3"} />
                <span>#01 ・ {location}</span> 
            </div>
          </div>

     <div className="flex flex-col gap-1 mb-4">
  {/* Subtitle / Category - 這是年輕部落格常見的設計細節 */}
  <span
    className={`font-medium tracking-[0.4em] text-white/30 uppercase ${
      compactHeader ? "text-[9px]" : "text-[10px] md:text-[11px]"
    }`}
  >
    Story & Vision
  </span>

  <h2
    className={`font-extralight leading-[1.1] tracking-[0.05em] text-white/90 ${
      compactHeader ? "text-2xl sm:text-3xl" : "text-3xl md:text-4xl lg:text-5xl"
    }`}
  >
    {data.title}
  </h2>
  
  {/* Optional: 裝飾性細線，增加現代感 */}
  <div className="w-8 h-[1px] bg-white/20 mt-4" />
</div>
          {/* 隨機生成的描述短語 */}
          <p
            className={`text-white/70 font-light leading-relaxed max-w-xl ${
              compactHeader ? "text-sm sm:text-base mb-6" : "text-lg md:text-xl mb-10"
            }`}
          >
             {randomQuote}
          </p>
        </div>

        {/* Right Column: CTA Pill (Modern Rounded Style) */}
        <div className="flex-shrink-0">
          {/* 懸停顏色變為淺紅 */}
          <div
            className={`inline-flex items-center gap-2 bg-transparent border border-white/30 text-white font-medium rounded-full group-hover:bg-[#ff8a8a] group-hover:border-[#ff8a8a] transition-all duration-300 ${
              compactHeader ? "text-xs px-5 py-2.5" : "text-sm px-8 py-4"
            }`}
          >
            開始探索
            <ArrowRight
              className={`${
                compactHeader ? "w-4 h-4" : "w-5 h-5"
              } group-hover:translate-x-1 transition-transform`}
            />
          </div>
        </div>
      </div>

      {/* ── Top-right issue number (Moiderm Minimalism) ── */}
      <div className={`absolute z-10 text-right ${compactHeader ? "top-6 right-6" : "top-10 right-10"}`}>
        <p className={`text-white/20 font-medium tracking-[0.3em] uppercase ${compactHeader ? "text-[10px]" : "text-[11px]"}`}>
          期數
        </p>
        {/* 期數文字 font weight thin，極簡風格 */}
        <p
          className={`text-white/50 font-thin leading-none tracking-tight ${
            compactHeader ? "text-5xl" : "text-6xl md:text-7xl"
          }`}
        >
          01
        </p>
      </div>
    </Link>
  );
};