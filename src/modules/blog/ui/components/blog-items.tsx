"use client";

import Image from "next/image";
import Link from "next/link";
import { postsGetMany } from "@/modules/blog/types";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { ArrowUpRight } from "lucide-react";

// ── Horizontal snap-scroll card (Latest strip) ──────────────────
export const HorizontalStripItem = ({ post }: { post: postsGetMany[0] }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group block w-full mb-4"
  >
    <div className="relative overflow-hidden rounded-xl bg-[#141414] border border-white/8 group-hover:border-red-500/30 transition-all duration-300" style={{ aspectRatio: "5/1" }}>
      <Image
        src={keyToUrl(post.coverImage) || "/placeholder.svg"}
        alt={post.title || ""}
        fill
        unoptimized
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/10" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
<h3 className="text-white font-light text-sm md:text-lg leading-snug line-clamp-2 group-hover:text-red-400 transition-colors duration-200 uppercase tracking-widest mb-1">
  {post.title}
</h3>
        
        {post.description && (
            <p className="text-white/70 text-xs font-light line-clamp-2">
                {post.description}
            </p>
        )}
      </div>
      {/* Arrow badge top-right */}
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#0e0e0e]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <ArrowUpRight className="w-3.5 h-3.5 text-white" />
      </div>
    </div>
  </Link>
);

// ── Masonry / columns grid card (All stories) ───────────────────
export const GridItem = ({ post, index }: { post: postsGetMany[0]; index: number }) => (
  <Link
    href={`/blog/${post.slug}`}
    className="group block mb-4 w-full"
  >
    <div className="flex gap-4 rounded-xl bg-[#141414] border border-white/8 group-hover:border-red-500/30 transition-all duration-300 overflow-hidden">
      {/* Left: Image */}
      <div className="w-1/3 relative" style={{ aspectRatio: "1/1" }}>
        <Image
          src={keyToUrl(post.coverImage) || "/placeholder.svg"}
          alt={post.title || ""}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      {/* Right: Content */}
      <div className="w-2/3 p-4 flex flex-col">
        <p className="text-white/25 text-[9px] font-black tracking-[0.2em] uppercase mb-1">#{index}</p>
      <h3 className="text-white font-light text-sm md:text-lg leading-snug line-clamp-2 group-hover:text-red-400 transition-colors duration-200 uppercase tracking-widest mb-1">
  {post.title}
</h3>
        {post.description && (
            <p className="text-white/50 text-xs font-light line-clamp-2">
                {post.description}
            </p>
        )}
        <div className="flex-grow" />
        <ArrowUpRight className="w-4 h-4 text-red-500 self-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5" />
      </div>
    </div>
  </Link>
);

// Legacy export kept for any remaining imports
export const PostsSection = ({ data }: { data: postsGetMany }) => {
  const strip = data.slice(1, 5);
  const grid  = data.slice(5);
  return (
    <>
      {strip.map((p) => <HorizontalStripItem key={p.id} post={p} />)}
      {grid.map((p, i) => <GridItem key={p.id} post={p} index={i + 6} />)}
    </>
  );
};
