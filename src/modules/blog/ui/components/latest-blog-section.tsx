"use client";

// External dependencies
import Image from "next/image";
import Link from "next/link";
// UI Components
import { Badge } from "@/components/ui/badge";
import { postsGetMany } from "@/modules/blog/types";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { ArrowRight } from "lucide-react";

interface LatestPostSectionProps {
  data?: postsGetMany[0];
}

export const LatestPostSection = ({ data }: LatestPostSectionProps) => {
  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-xl">
        <p className="text-muted-foreground">No blog available</p>
      </div>
    );
  }

  return (
    <Link
      href={`/blog/${data.slug}`}
      className="block w-full h-full relative rounded-xl overflow-hidden group cursor-pointer"
    >
      <Image
        src={keyToUrl(data.coverImage) || "/placeholder.svg"}
        alt={data.title || "Blog post"}
        fill
        unoptimized
        priority
        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div className="absolute w-full bottom-0 p-4 md:p-6">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-red-500 text-white hover:bg-red-600 border-0">
              New
            </Badge>
            <h2 className="font-semibold text-white text-lg">{data.title}</h2>
          </div>
          <div className="flex items-center gap-1.5 text-red-300 text-sm font-medium">
            <span>Read article</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
