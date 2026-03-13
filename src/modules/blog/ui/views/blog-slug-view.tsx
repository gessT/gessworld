"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Tag, ChevronDown, Mail, Instagram, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/footer";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import RichTextViewer from "@/components/editor/rich-text-viewer";

export const BlogSlugView = ({ slug }: { slug: string }) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.blog.getOne.queryOptions({ slug }));

  const tag = Array.isArray(data.tags) ? data.tags[0] : data.tags;

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ── 全螢幕沉浸式 Hero ───────────────────────────────────────── */}
      <div className="relative w-full h-[100vh] overflow-hidden">
        {/* 背景圖片 */}
        <Image
          src={keyToUrl(data.coverImage) || "/placeholder.svg"}
          alt={data.title || "旅途故事"}
          fill
          priority
          quality={90}
          className="object-cover scale-105" // 輕微放大的藝術感
        />

        {/* 多層次漸變：增加底部的深邃感 */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20" />
        <div className="absolute inset-0 bg-black/10" />

        {/* 返回按鈕：輕量圓角設計 */}
        <div className="absolute top-8 left-6 md:left-10 z-10">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 bg-black/20 backdrop-blur-md hover:bg-white hover:text-black border border-white/10 text-white rounded-full px-5 py-2.5 text-[10px] font-light tracking-[0.2em] uppercase transition-all duration-500"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            返回網誌故事
          </Link>
        </div>

        {/* 品牌標誌：改為極簡文字 */}
        <div className="absolute top-8 right-6 md:right-10 z-10">
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-[9px] font-extralight tracking-[0.4em] uppercase">
              Snaptogoclub • Travel
            </span>
          </div>
        </div>

        {/* Hero 底部內容 */}
        <div className="absolute bottom-20 left-0 z-10 w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-5xl">
            {/* 分類與時間 */}
            <div className="flex items-center gap-4 mb-8">
              {tag && (
                <span className="text-red-500 text-[10px] font-medium tracking-[0.3em] uppercase">
                  # {tag}
                </span>
              )}
              <div className="w-8 h-[1px] bg-white/20" />
              {data.readingTimeMinutes && (
                <span className="text-white/40 text-[10px] font-light tracking-[0.2em] uppercase flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {data.readingTimeMinutes} 分鐘閱讀
                </span>
              )}
            </div>

            {/* 主標題：改為輕量大標題 */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight uppercase mb-8 break-words max-w-4xl">
              {data.title}
            </h1>

            {/* 描述：增加行高與透明度 */}
            {data.description && (
              <p className="text-white/50 text-base sm:text-lg max-w-2xl leading-relaxed font-extralight tracking-wide mb-12">
                {data.description}
              </p>
            )}

            {/* 捲動引導 */}
            <div className="inline-flex items-center gap-3 text-white/30 text-[9px] font-light tracking-[0.4em] uppercase">
              <span className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
              向下捲動閱讀
            </div>
          </div>
        </div>
      </div>

      {/* ── 文章主體區域 ─────────────────────────────────────────── */}
      <div className="relative">
        {/* 頂部粘性導航條：極簡化 */}
        <div className="sticky top-0 z-20 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
            <p className="text-white/30 text-[9px] font-light tracking-[0.3em] uppercase truncate pr-8">
              {data.title}
            </p>
            <div className="flex items-center gap-6">
              <Globe className="w-3.5 h-3.5 text-red-500/50" />
            </div>
          </div>
        </div>

        {/* 文章內容 */}
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">
          {/* 引言設計 */}
          <div className="flex items-start gap-4 mb-20">
             <div className="w-1 h-12 bg-red-500/80 rounded-full" />
             <p className="text-white/60 text-xs md:text-sm font-light tracking-[0.2em] leading-loose">
               SNAPTOGOCLUB <br /> 
               用快門記錄世界，用文字封存旅途感悟。
             </p>
          </div>

          {/* 正文內容 */}
          <div className="prose-invert rich-text-viewer selection:bg-red-500/30">
            <RichTextViewer content={data.content || ""} />
          </div>
        </div>

        {/* ── 底部社群引導 ─────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="text-center mb-12 space-y-3">
            <h3 className="text-xl font-light tracking-[0.3em] uppercase">追蹤旅程</h3>
            <p className="text-white/30 text-xs font-extralight tracking-widest">與我們一起探索下一個目的地</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="https://instagram.com/gess.tue/"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-full py-4 text-[11px] font-light tracking-[0.2em] uppercase transition-all duration-500"
            >
              <Instagram className="w-4 h-4" />
              Instagram
            </Link>
            <Link
              href="mailto:tueguosheng@gmail.com"
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white rounded-full py-4 text-[11px] font-light tracking-[0.2em] uppercase transition-all duration-500 shadow-lg shadow-red-600/20"
            >
              <Mail className="w-4 h-4" />
              聯絡我們
            </Link>
            <Link
              href="/blog"
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 rounded-full py-4 text-[11px] font-light tracking-[0.2em] uppercase transition-all"
            >
              更多旅途故事
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};