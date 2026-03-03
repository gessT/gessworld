"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import CardContainer from "@/components/card-container";
import Footer from "@/components/footer";
import ContactCard from "@/components/contact-card";
import { PostsSection } from "../components/blog-items";
import { LatestPostSection } from "../components/latest-blog-section";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

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
      <div className="w-full lg:w-1/2 space-y-4 pb-3 pt-3 lg:pt-0">
        {/* DESCRIPTION CARD  */}
        <CardContainer>
          <div className="flex flex-col p-8 md:p-12 gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 dark:bg-red-500/10 p-2.5 rounded-xl">
                <BookOpen className="w-6 h-6 text-red-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Blog</h1>
            </div>
            <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed">
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

        {/* POST LIST  */}
        <PostsSection data={data} />

        {/* CONTACT CARDS  */}
        <div className="w-full grid grid-cols-2 gap-3 mt-3">
          <ContactCard title="Instagram" />
          <ContactCard title="X" />
          <ContactCard
            title="Contact me"
            className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
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
      <div className="w-full lg:w-1/2 space-y-4 pb-3 pt-3 lg:pt-0">
        {/* DESCRIPTION CARD SKELETON */}
        <CardContainer>
          <div className="flex flex-col p-8 md:p-12 gap-8">
            <div className="flex items-center gap-3">
              <Skeleton className="w-11 h-11 rounded-xl" />
              <Skeleton className="h-8 w-20" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </CardContainer>

        {/* POST LIST SKELETON */}
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-3/4 rounded-2xl overflow-hidden">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>

        {/* CONTACT CARDS  */}
        <div className="w-full grid grid-cols-2 gap-3 mt-3">
          <ContactCard title="Instagram" />
          <ContactCard title="X" />
          <ContactCard
            title="Contact me"
            className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600"
          />
        </div>

        {/* FOOTER  */}
        <Footer />
      </div>
    </div>
  );
};
