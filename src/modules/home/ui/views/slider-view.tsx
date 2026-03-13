"use client";

// UI Components
import Link from "next/link";
import Carousel from "@/components/photo-carousel";
import BlurImage from "@/components/blur-image";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ImageOff } from "lucide-react";

export const SliderView = () => {
  const trpc = useTRPC();
  const { data: photos } = useSuspenseQuery(
    trpc.home.getManyLikePhotos.queryOptions({ limit: 10 })
  );

  if (photos.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="h-12 w-12" />}
        title="No photos yet"
        description="Upload some photos and like your favorites to get started"
        action={
          <Button asChild>
            <Link href="/dashboard/photos">Go to Dashboard</Link>
          </Button>
        }
        height="h-full"
      />
    );
  }

  return (
    <Carousel
      className="absolute top-0 left-0 w-full h-full"
      containerClassName="h-full"
    >
      {photos.map((photo, index) => {
        const isFirstSlide = index === 0;

        return (
          <div key={photo.id} className="flex-[0_0_100%] h-screen relative overflow-hidden bg-black">
            {/* 1. 壓暗遮罩：使用漸變讓底部更暗，方便承載文字，同時整體降亮度 */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

            {/* 2. 圖片處理 */}
            <BlurImage
              src={keyToUrl(photo.url)}
              alt={photo.title}
              fill
              sizes="100vw"
              loading={isFirstSlide ? "eager" : "lazy"}
              fetchPriority={isFirstSlide ? "high" : undefined}
              blurhash={photo.blurData}
              className="
      w-full h-full 
      object-cover 
      object-top 
      brightness-[0.8] 
      contrast-[1.05]
      transition-transform 
      duration-[20s] 
      scale-105
    "
            // object-top: 確保從照片頂部開始對齊，不切掉頭部
            // brightness-[0.8]: 整體壓暗 20%
            // brightness 配合 gradient 遮罩可以營造高級電影感
            />
          </div>
        );
      })}
    </Carousel>
  );
};

export const SliderViewLoadingStatus = () => {
  return (
    <div className="w-full h-full">
      <Skeleton className="w-full h-full" />
    </div>
  );
};
