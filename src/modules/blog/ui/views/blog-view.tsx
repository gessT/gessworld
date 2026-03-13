"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import CardContainer from "@/components/card-container";
import Footer from "@/components/footer";
import ContactCard from "@/components/contact-card";
import { PostsSection } from "../components/blog-items";
import { LatestPostSection } from "../components/latest-blog-section";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";

export const BlogView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.blog.getMany.queryOptions());

  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed */}
      <div className="w-full h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 md:h-[80vh] lg:h-screen p-0 lg:p-3 group">
        <LatestPostSection data={data?.[0]} />
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        {/* DESCRIPTION CARD  */}
        <div className="relative overflow-hidden rounded-2xl border border-white/8">
          {/* Background image */}
          <Image
            src="/blogbg.jpg"
            alt="Blog background"
            fill
            className="object-cover"
          />
          {/* Dark overlay so text is readable */}
          <div className="absolute inset-0 bg-[#0e0e0e]/70" />

          <div className="relative z-10 flex flex-col sm:flex-row">

            {/* Left: text content */}
            <div className="flex-1 px-8 py-10 sm:px-12 sm:py-14 relative z-10">
              {/* Background label watermark */}
              <span className="pointer-events-none absolute -right-4 -top-6 text-[120px] font-black text-white/[0.03] leading-none select-none uppercase tracking-tighter">
                Blog
              </span>

              {/* Top row */}
              <div className="flex items-center gap-3 mb-10">
                <div className="w-1 h-5 bg-red-500 rounded-full" />
                <span className="text-white/40 text-[10px] font-black tracking-[0.25em] uppercase">
                  Snaptogoclub · Travel Stories
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl font-black leading-[0.9] tracking-tight uppercase text-white mb-8">
                Stories<br />
                <span className="text-white/25">& Moments</span>
              </h1>

              {/* Divider */}
              <div className="w-12 h-px bg-red-500 mb-8" />

              {/* Body copy */}
              <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-sm font-light">
                旅行不只是移動，是用鏡頭記錄每一個當下——
                從寧靜的北歐小鎮到日本的古老街道，
                每一張照片都有屬於它的故事。
              </p>
            </div>
          </div>
        </div>

        {/* POST LIST  */}

        <PostsSection data={data} />

        {/* CONTACT CARDS  */}
        <div className="w-full grid grid-cols-2 gap-3 mt-3">
          <ContactCard title="Instagram" />
          {/* <ContactCard title="GitHub" />
          <ContactCard title="X" /> */}
          <ContactCard
            title="Contact me"
            className="bg-primary hover:bg-primary-hover text-white dark:text-black"
          />
        </div>

        {/* FOOTER  */}
        <Footer />
      </div>
    </div>
  );
};

export const BlogViewLoadingStatus = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
      {/* LEFT CONTENT - Fixed */}
      <div className="w-full h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 md:h-[80vh] lg:h-screen p-0 lg:p-3 group">
        <Skeleton className="w-full h-full rounded-xl" />
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full lg:w-1/2 space-y-3 pb-3">
        {/* DESCRIPTION CARD SKELETON */}
        <CardContainer>
          <div className="flex flex-col p-12 gap-[128px]">
            <h1 className="text-3xl">Blog</h1>
            <div className="flex flex-col gap-4 font-light">
              <p>
                Welcome to my blog, where I share my thoughts, experiences, and
                insights on a wide range of topics. Whether you&apos;re a
                photographer, a traveler, or simply someone who appreciates the
                beauty of life, my blog is a place to connect with others who
                share my passion for capturing moments and telling stories.
              </p>
            </div>
          </div>
        </CardContainer>

        {/* POST LIST SKELETON */}

        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-3/4 rounded-xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>

        {/* CONTACT CARDS  */}
        <div className="w-full grid grid-cols-2 gap-3 mt-3">
          <ContactCard title="Instagram" />
          {/* <ContactCard title="GitHub" />
          <ContactCard title="X" /> */}
          <ContactCard
            title="Contact me"
            className="bg-primary hover:bg-primary-hover text-white dark:text-black"
          />
        </div>

        {/* FOOTER  */}
        <Footer />
      </div>
    </div>
  );
};
