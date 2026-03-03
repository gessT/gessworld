"use client";

// External dependencies
import Image from "next/image";
import Link from "next/link";

// Internal dependencies - UI Components
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { postsGetMany } from "@/modules/blog/types";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { ArrowRight } from "lucide-react";

interface PostsSectionProps {
  data: postsGetMany;
}

export const PostsSection = ({ data }: PostsSectionProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Skip the first post (already shown in LatestPostSection)
  const postsToShow = data.slice(1);

  if (postsToShow.length === 0) {
    return null;
  }

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-4">
      {postsToShow.map((item) => (
        <AspectRatio ratio={3 / 4} key={item.id}>
          <Link
            href={`/blog/${item.slug}`}
            className="block w-full h-full relative rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <Image
              src={keyToUrl(item.coverImage) || "/placeholder.svg"}
              alt={item.title || "Blog post"}
              fill
              unoptimized
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute w-full bottom-0 p-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                <h2 className="font-semibold text-white line-clamp-2 mb-2">{item.title}</h2>
                <div className="flex items-center gap-1.5 text-red-300 text-sm font-medium">
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </AspectRatio>
      ))}
    </div>
  );
};
