"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Footer from "@/components/footer";
import { PostsSection } from "../components/blog-items";
import { LatestPostSection } from "../components/latest-blog-section";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export const BlogView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.blog.getMany.queryOptions());

  return (
    <div className="min-h-screen w-full bg-[#0e0e0e] text-white">

      {/* ── STICKY MASTHEAD ───────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-[#0e0e0e]/95 backdrop-blur-sm border-b border-white/8">
        <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-red-500" />
            <h1 className="text-white font-black text-xl tracking-tight">
              Stories
            </h1>
            <span className="text-white/25 font-black text-xl">/</span>
            <span className="text-white/30 text-sm font-medium">{data.length} published</span>
          </div>
          <div className="text-red-500 text-[10px] font-black tracking-[0.25em] uppercase">
            Snaptogoclub
          </div>
        </div>
      </div>

      {/* ── HERO — Full-width featured post ───────────────────── */}
      <div className="w-full h-[70vh] lg:h-[80vh] relative overflow-hidden">
        <LatestPostSection data={data?.[0]} />
      </div>

      {/* ── BELOW THE FOLD ────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-6 sm:px-10 py-10">
        <PostsSection data={data} />
      </div>

      {/* ── CONNECT STRIP ─────────────────────────────────────── */}
      <div className="border-t border-white/8 max-w-screen-xl mx-auto px-6 sm:px-10 py-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="https://instagram.com"
          target="_blank"
          className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-xl py-4 text-sm font-bold transition-all duration-200"
        >
          <Instagram className="w-4 h-4" />
          Instagram
        </Link>
        <Link
          href="https://x.com"
          target="_blank"
          className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-xl py-4 text-sm font-bold transition-all duration-200"
        >
          <Twitter className="w-4 h-4" />
          Twitter / X
        </Link>
        <Link
          href="mailto:hello@snaptogoclub.com"
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 border border-red-500 text-white rounded-xl py-4 text-sm font-bold transition-all duration-200"
        >
          <Mail className="w-4 h-4" />
          Contact me
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export const BlogViewLoadingStatus = () => {
  return (
    <div className="min-h-screen w-full bg-[#0e0e0e]">
      {/* Masthead skeleton */}
      <div className="border-b border-white/8 px-10 py-4">
        <Skeleton className="h-5 w-32 bg-white/10" />
      </div>
      {/* Hero skeleton */}
      <Skeleton className="w-full h-[70vh] lg:h-[80vh]" />
      {/* Below-fold skeleton */}
      <div className="max-w-screen-xl mx-auto px-10 py-10 grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Skeleton className="lg:col-span-2 aspect-[3/4] rounded-2xl bg-white/10" />
        <div className="lg:col-span-3 flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0 bg-white/10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-white/10" />
                <Skeleton className="h-3 w-1/2 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
