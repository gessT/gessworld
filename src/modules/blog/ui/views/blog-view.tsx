"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Footer from "@/components/footer";
import ContactCard from "@/components/contact-card";
import { PostsSection } from "../components/blog-items";
import { LatestPostSection } from "../components/latest-blog-section";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export const BlogView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.blog.getMany.queryOptions());

  return (
    <div className="flex flex-col gap-4 lg:gap-8 lg:flex-row w-full bg-[#050505] p-3 lg:p-4">
      {/* ── LEFT CONTENT: 調整為 40% 寬度 (w-5/12) ── */}
 <div className="hidden lg:block lg:w-5/12 lg:fixed lg:top-4 lg:left-4 lg:h-[calc(100vh-2rem)] rounded-3xl overflow-hidden shadow-2xl">
        <LatestPostSection data={data?.[0]} />
      </div>

      {/* Spacer (用來推開右側內容，寬度必須與左側相同) */}
      <div className="hidden lg:block lg:w-5/12 shrink-0" />

      {/* ── RIGHT CONTENT: 調整為 60% 寬度 (w-7/12)，給予更多呼吸空間 ── */}
      <div className="w-full lg:w-7/12 space-y-6 pb-6 lg:pr-4">
        {/* MOBILE FEATURED LATEST POST */}
        <div className="lg:hidden">
          <LatestPostSection data={data?.[0]} compactHeader />
        </div>

        
        {/* DESCRIPTION CARD: 調整為寬幅電影比例 (Cinema Aspect) */}
        <div className="relative overflow-hidden rounded-3xl border border-white/5 min-h-[400px] lg:min-h-[480px] flex items-end">
          {/* Background image */}
          <Image
            src="/blogbg.jpg"
            alt="揪旅啦 背景"
            fill
            className="object-cover transition-transform duration-1000 hover:scale-[1.03]"
          />
          {/* 漸層遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-[2px] bg-black/10" />

          <div className="relative z-10 w-full p-8 sm:p-12 lg:p-16">
            {/* Background label watermark */}
            <span className="pointer-events-none absolute right-4 bottom-12 text-[100px] sm:text-[140px] font-thin text-white/[0.03] leading-none select-none tracking-[0.1em]">
              揪旅啦
            </span>

            {/* Top row */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-[1px] bg-red-500" />
              <span className="text-white/40 text-[9px] font-light tracking-[0.4em] uppercase">
                Jiotriplah · Travel Stories
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-thin leading-[1.05] tracking-widest uppercase text-white mb-6">
              Stories<br />
              <span className="text-white/30 italic font-extralight">& Moments</span>
            </h1>

            {/* Body copy: 加寬 max-width 讓排版更舒展 */}
            <p className="text-white/50 text-sm sm:text-base leading-loose max-w-md font-light tracking-[0.15em]">
              旅行不只是移動，是用鏡頭記錄每一個當下。
              從寧靜的北歐小鎮到日本的古老街道，
              每一張照片都有屬於它的故事。
            </p>
          </div>
        </div>

        {/* POST LIST */}
        <div className="pt-2">
          <PostsSection data={data} />
        </div>

        {/* CONTACT CARDS */}
        {/* <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <ContactCard title="Instagram" />
          <ContactCard
            title="WhatsApp me"
            className="bg-red-600 hover:bg-red-500 text-white border-transparent shadow-lg shadow-red-600/10"
          />
        </div> */}

        {/* FOOTER */}
        <div className="pt-8">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export const BlogViewLoadingStatus = () => {
  return (
    <div className="flex flex-col gap-4 lg:gap-8 lg:flex-row w-full bg-[#050505] p-3 lg:p-4">
      {/* LEFT CONTENT SKELETON (40%) */}
      <div className="hidden lg:block lg:w-5/12 lg:fixed lg:top-4 lg:left-4 lg:h-[calc(100vh-2rem)] p-0 group">
        <Skeleton className="w-full h-full rounded-3xl bg-white/5" />
      </div>

      <div className="hidden lg:block lg:w-5/12 shrink-0" />

      {/* RIGHT CONTENT SKELETON (60%) */}
      <div className="w-full lg:w-7/12 space-y-6 pb-6 lg:pr-4">
        <div className="lg:hidden h-[48vh] rounded-3xl overflow-hidden">
          <Skeleton className="w-full h-full bg-white/5" />
        </div>

        {/* DESCRIPTION CARD SKELETON */}
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 min-h-[400px] lg:min-h-[480px] p-8 sm:p-12 lg:p-16 flex flex-col justify-end">
          <Skeleton className="w-32 h-4 bg-white/10 mb-8" />
          <Skeleton className="w-3/4 h-12 lg:h-16 bg-white/10 mb-4" />
          <Skeleton className="w-1/2 h-12 lg:h-16 bg-white/10 mb-10" />
          <Skeleton className="w-full h-4 bg-white/10 mb-4" />
          <Skeleton className="w-5/6 h-4 bg-white/10" />
        </div>

        {/* POST LIST SKELETON */}
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-3/4 rounded-2xl overflow-hidden">
              <Skeleton className="w-full h-full bg-white/5" />
            </div>
          ))}
        </div>

        {/* CONTACT CARDS SKELETON */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
           <Skeleton className="w-full h-[72px] rounded-full bg-white/5" />
           <Skeleton className="w-full h-[72px] rounded-full bg-white/5" />
        </div>

        <div className="pt-8">
          <Skeleton className="w-full h-24 rounded-3xl bg-white/5" />
        </div>
      </div>
    </div>
  );
};