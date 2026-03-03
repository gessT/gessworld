"use client";

import Image from "next/image";
import Link from "next/link";
import { postsGetMany } from "@/modules/blog/types";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { ArrowRight, BookOpen } from "lucide-react";

interface LatestPostSectionProps {
  data?: postsGetMany[0];
}

export const LatestPostSection = ({ data }: LatestPostSectionProps) => {
  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#141414]">
        <p className="text-white/30 text-sm">No stories yet</p>
      </div>
    );
  }

  return (
    <Link
      href={`/blog/${data.slug}`}
      className="block w-full h-full relative overflow-hidden group cursor-pointer"
    >
      <Image
        src={keyToUrl(data.coverImage) || "/placeholder.svg"}
        alt={data.title || "Blog post"}
        fill
        unoptimized
        priority
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out scale-105"
      />

      {/* Dark vignette — heavier at bottom, lighter at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-[#0e0e0e]/10" />

      {/* Centered editorial text layout */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 sm:px-16 text-center z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white/60 text-xs font-bold tracking-[0.25em] uppercase">Cover Story</span>
        </div>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6 max-w-4xl">
          {data.title}
        </h2>
        <div className="inline-flex items-center gap-2 text-white font-bold text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 group-hover:bg-red-600 group-hover:border-red-500 transition-all duration-300">
          <BookOpen className="w-3.5 h-3.5" />
          Read story
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
