"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Tag, ChevronDown, Mail, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/footer";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import RichTextViewer from "@/components/editor/rich-text-viewer";

export const BlogSlugView = ({ slug }: { slug: string }) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.blog.getOne.queryOptions({ slug }));

  const tag = Array.isArray(data.tags) ? data.tags[0] : data.tags;
console.log("BlogSlugView data:", data);
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">

      {/* ── FULL-BLEED HERO ───────────────────────────────────────── */}
      <div className="relative w-full" style={{ height: "100vh" }}>
        {/* Cover image */}
        <Image
          src={keyToUrl(data.coverImage) || "/placeholder.svg"}
          alt={data.title || "Article cover"}
          fill
          priority
          quality={85}
          className="object-cover"
        />

        {/* Multi-layer gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-[#0e0e0e]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/50 via-transparent to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-[#0e0e0e]/60 backdrop-blur-sm hover:bg-[#0e0e0e]/80 border border-white/15 text-white rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Stories
          </Link>
        </div>

        {/* Brand pill */}
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-red-600/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-[10px] font-black tracking-widest uppercase">
              Snaptogoclub
            </span>
          </div>
        </div>

        {/* Hero bottom content */}
        <div className="absolute bottom-0 left-0 z-10 w-full px-6 sm:px-12 lg:px-20 pb-16">
          {/* Meta pills */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {tag && (
              <span className="inline-flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-sm">
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            )}
            {data.readingTimeMinutes && (
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white/70 text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm">
                <Clock className="w-2.5 h-2.5" />
                {data.readingTimeMinutes} min read
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight uppercase max-w-4xl mb-5">
            {data.title}
          </h1>

          {/* Description */}
          {data.description && (
            <p className="text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              {data.description}
            </p>
          )}

          {/* Scroll hint */}
          <div className="flex items-center gap-2 text-white/30 text-xs font-bold tracking-[0.2em] uppercase">
            <ChevronDown className="w-4 h-4 animate-bounce" />
            Scroll to read
          </div>
        </div>
      </div>

      {/* ── ARTICLE BODY ─────────────────────────────────────────── */}
      <div className="relative">
        {/* Sticky reading bar */}
        <div className="sticky top-16 z-20 bg-[#0e0e0e]/95 backdrop-blur-sm border-b border-white/8">
          <div className="max-w-3xl mx-auto px-6 sm:px-10 h-10 flex items-center justify-between">
            <p className="text-white/40 text-[10px] font-black tracking-[0.2em] uppercase line-clamp-1 flex-1 pr-4">
              {data.title}
            </p>
            <div className="flex items-center gap-4 flex-shrink-0">
              {data.readingTimeMinutes && (
                <span className="text-white/25 text-[10px] font-bold tracking-wider hidden sm:block">
                  {data.readingTimeMinutes} min
                </span>
              )}
              {tag && (
                <span className="text-red-500 text-[10px] font-black tracking-[0.15em] uppercase">
                  {tag}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Article content */}
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-16">
          {/* Drop cap intro line */}
          <div className="border-l-2 border-red-500 pl-6 mb-12">
            <p className="text-white/50 text-sm font-bold tracking-[0.15em] uppercase">
              Snaptogoclub · Travel Stories
            </p>
          </div>

          {/* Rich text */}
          <div className="prose-invert">
            <RichTextViewer content={data.content || ""} />
          </div>
        </div>

        {/* ── END OF ARTICLE STRIP ─────────────────────────────── */}
        <div className="border-t border-white/8 max-w-3xl mx-auto px-6 sm:px-10 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-5 bg-red-500 rounded-full" />
            <p className="text-white font-black text-lg tracking-tight">
              Follow the journey
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="https://instagram.com"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-xl py-4 text-sm font-bold transition-all duration-200"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Link>
            <Link
              href="mailto:hello@snaptogoclub.com"
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 border border-red-500 text-white rounded-xl py-4 text-sm font-bold transition-all duration-200"
            >
              <Mail className="w-4 h-4" />
              Get in touch
            </Link>
            <Link
              href="/blog"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white rounded-xl py-4 text-sm font-bold transition-all duration-200"
            >
              ← More stories
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
