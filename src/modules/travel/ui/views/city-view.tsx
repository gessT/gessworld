"use client";

import BlurImage from "@/components/blur-image";
import Footer from "@/components/footer";
import { FramedPhoto } from "@/components/framed-photo";
import VectorCombined from "@/components/vector-combined";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";

interface Props {
  city: string;
}

export const CityView = ({ city }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.travel.getOne.queryOptions({ city }));

  //can add privacy
  const coverPhoto = data.photos.find((item) => data.coverPhotoId === item.id);
  console.log(data)
  return (
    <div className="size-full">
      <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full">
        {/* LEFT CONTENT - Fixed */}
        <div className="w-full h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3">
          <div className="w-full h-full relative">
            <BlurImage
              src={keyToUrl(coverPhoto?.url) || "/placeholder.svg"}
              alt={data.city}
              fill
              quality={75}
              blurhash={coverPhoto?.blurData || ""}
              sizes="75vw"
              className="object-cover rounded-xl overflow-hidden"
            />
            <div className="absolute right-0 bottom-0">
              <VectorCombined title={data.city} position="bottom-right" />
            </div>
          </div>
        </div>

        {/* Spacer for fixed left content */}
        <div className="hidden lg:block lg:w-1/2" />

        {/* RIGHT CONTENT - Scrollable */}
        <div className="w-full lg:w-1/2 space-y-3 pb-3">
          {/* CITY INFO CARD  */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 2xl:grid-cols-3 gap-4 items-stretch">
            <div className="col-span-1 md:col-span-2 lg:col-span-1 2xl:col-span-2">
              <div className="flex flex-col p-8 md:p-10 gap-8 bg-card border border-border rounded-2xl shadow-sm h-full">
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 dark:bg-red-500/10 p-2.5 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {data.city}
                    </h1>
                    <p className="text-sm text-muted-foreground">{data.countryCode}</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {data.description}
                </p>
              </div>
            </div>

            <div className="col-span-1 md:col-span-1 lg:col-span-1 2xl:col-span-1 flex flex-col gap-3">
              <div className="w-full h-full p-4 bg-card border border-border rounded-xl flex justify-between items-center shadow-sm">
                <p className="text-xs text-muted-foreground font-medium">Country</p>
                <p className="text-xs font-semibold">{data.country}</p>
              </div>

              <div className="w-full h-full p-4 bg-card border border-border rounded-xl flex justify-between items-center shadow-sm">
                <p className="text-xs text-muted-foreground font-medium">City</p>
                <p className="text-xs font-semibold">{data.city}</p>
              </div>

              <div className="w-full h-full p-4 bg-card border border-border rounded-xl flex justify-between items-center shadow-sm">
                <p className="text-xs text-muted-foreground font-medium">Year</p>
                <p className="text-xs font-semibold">
                  {coverPhoto?.dateTimeOriginal
                    ? String(new Date(coverPhoto.dateTimeOriginal).getFullYear())
                    : "—"}
                </p>
              </div>

              <div className="w-full h-full p-4 bg-card border border-border rounded-xl flex justify-between items-center shadow-sm">
                <p className="text-xs text-muted-foreground font-medium">Photos</p>
                <p className="text-xs font-semibold text-red-500">{data.photos?.length}</p>
              </div>
            </div>
          </div>

          {/* IMAGES  */}
          <div className="w-full space-y-4">
            {data.photos?.map((photo) => (
              <Link
                href={`/p/${photo.id}`}
                key={photo.id}
                className="space-y-3 group block"
              >
                <div className="flex items-center justify-center bg-card border border-border p-4 rounded-2xl shadow-sm group-hover:shadow-md group-hover:border-red-200 dark:group-hover:border-red-500/20 transition-all duration-200">
                  <FramedPhoto
                    src={photo.url}
                    alt={photo.title}
                    blurhash={photo.blurData!}
                    width={photo.width}
                    height={photo.height}
                  />
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-sm font-semibold text-center group-hover:text-red-500 transition-colors">
                    {photo.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {photo.dateTimeOriginal
                      ? format(photo.dateTimeOriginal, "d MMM yyyy")
                      : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {/* FOOTER  */}
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
};
