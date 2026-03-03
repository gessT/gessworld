"use client";

import Image from "next/image";
import Link from "next/link";
import { postsGetMany } from "@/modules/blog/types";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { ArrowRight } from "lucide-react";

interface PostsSectionProps {
  data: postsGetMany;
}

export const PostsSection = ({ data }: PostsSectionProps) => {
  if (!data || data.length === 0) return null;

  const postsToShow = data.slice(1);
  if (postsToShow.length === 0) return null;

  const secondaryFeatured = postsToShow[0];   // big card
  const rest = postsToShow.slice(1);           // compact list

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

      {/* ── LEFT: secondary feature card ── */}
      {secondaryFeatured && (
        <Link
          href={`/blog/${secondaryFeatured.slug}`}
          className="group block lg:col-span-2"
        >
          <div
            className="relative overflow-hidden rounded-2xl bg-[#141414] border border-white/8 group-hover:border-red-500/30 transition-all duration-300"
            style={{ aspectRatio: "3/4" }}
          >
            <Image
              src={keyToUrl(secondaryFeatured.coverImage) || "/placeholder.svg"}
              alt={secondaryFeatured.title || ""}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/95 via-[#0e0e0e]/20 to-transparent" />

            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/10 backdrop-blur-sm border border-white/15 text-white text-[10px] font-black tracking-widest uppercase rounded-full px-3 py-1">
                Editor&apos;s Pick
              </span>
            </div>

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="font-black text-white text-xl leading-snug line-clamp-3 mb-3 group-hover:text-red-400 transition-colors duration-200">
                {secondaryFeatured.title}
              </h2>
              <div className="inline-flex items-center gap-1.5 text-white/50 group-hover:text-red-400 text-xs font-bold transition-colors duration-200">
                Read story <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ── RIGHT: compact article list ── */}
      {rest.length > 0 && (
        <div className="lg:col-span-3 flex flex-col">
          {/* Section label */}
          <p className="text-white/25 text-[10px] font-black tracking-[0.25em] uppercase mb-4 pb-3 border-b border-white/8">
            More Stories
          </p>
          <div className="flex flex-col divide-y divide-white/8">
            {rest.map((item, index) => (
              <Link
                key={item.id}
                href={`/blog/${item.slug}`}
                className="group flex items-center gap-4 py-4 hover:bg-white/[0.03] px-3 -mx-3 rounded-xl transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-red-500/30 transition-all duration-200">
                  <Image
                    src={keyToUrl(item.coverImage) || "/placeholder.svg"}
                    alt={item.title || ""}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/25 text-[10px] font-bold tracking-[0.15em] uppercase mb-1">
                    #{index + 3}
                  </p>
                  <h2 className="text-white/70 group-hover:text-white font-bold text-sm leading-snug line-clamp-2 transition-colors duration-200">
                    {item.title}
                  </h2>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
