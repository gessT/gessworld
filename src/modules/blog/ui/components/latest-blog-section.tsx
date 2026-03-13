"use client";

import Image from "next/image";
import Link from "next/link";
import { postsGetMany } from "@/modules/blog/types";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { ArrowUpRight } from "lucide-react";

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
      {/* Image */}
      <Image
        src={keyToUrl(data.coverImage) || "/placeholder.svg"}
        alt={data.title || ""}
        fill
        unoptimized
        priority
        className="object-cover group-hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
      />

      {/* Bottom heavy vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/50 to-transparent" />
      {/* Left vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/60 via-transparent to-transparent" />

      {/* ── Bottom-left editorial block (Highsnobiety style) ── */}
      <div className="absolute bottom-0 left-0 p-8 sm:p-12 lg:p-16 z-10 max-w-3xl">
        {/* Label row */}
        <div className="flex items-center gap-3 mb-5">
          <span className="bg-red-600 text-white text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm">
            Cover Story
          </span>
          <span className="text-white/40 text-[10px] font-bold tracking-[0.15em] uppercase">
            #01
          </span>
        </div>

        {/* Headline — massive Hypebeast-style */}
     
          <h2 className="text-lg md:text-xl text-muted-foreground leading-relaxed lg:text-6xl font-light tracking-tight text-white/90 mb-6 max-w-2xl">
      {data.title}
  </h2>


        {/* CTA pill */}
        <div className="inline-flex items-center gap-2 border border-white/30 text-white font-black text-sm uppercase tracking-widest px-6 py-3 rounded-sm group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
          Read now
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* Top-right issue number */}
      <div className="absolute top-8 right-8 z-10 text-right">
        <p className="text-white/20 text-[10px] font-black tracking-[0.3em] uppercase">Issue</p>
        <p className="text-white/50 text-4xl font-black leading-none">01</p>
      </div>
    </Link>
  );
};
