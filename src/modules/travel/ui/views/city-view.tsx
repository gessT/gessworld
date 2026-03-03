"use client";

import BlurImage from "@/components/blur-image";
import Footer from "@/components/footer";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Camera, MapPin, Calendar, Globe } from "lucide-react";

interface Props {
  city: string;
}

export const CityView = ({ city }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.travel.getOne.queryOptions({ city }));

  const coverPhoto = data.photos.find((item) => data.coverPhotoId === item.id);
  const year = coverPhoto?.dateTimeOriginal
    ? new Date(coverPhoto.dateTimeOriginal).getFullYear()
    : null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#0e0e0e] text-white">
      {/* ── LEFT — Cinematic fixed cover ─────────────────────────── */}
      <div className="w-full h-[75vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen">
        <div className="relative w-full h-full overflow-hidden">
          {coverPhoto && (
            <BlurImage
              src={keyToUrl(coverPhoto.url)}
              alt={data.city}
              fill
              quality={80}
              blurhash={coverPhoto.blurData || ""}
              sizes="50vw"
              className="object-cover scale-105"
            />
          )}
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0e0e0e]/30" />

          {/* City name overlay */}
          <div className="absolute bottom-0 left-0 z-10 p-8 lg:p-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase">
                {data.country}
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-none mb-3">
              {data.city}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5">
                <Camera className="w-3.5 h-3.5 text-red-400" />
                <span className="text-xs font-semibold">{data.photos.length} Photos</span>
              </div>
              {year && (
                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5">
                  <Calendar className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs font-semibold">{year}</span>
                </div>
              )}
            </div>
          </div>

          {/* Back button */}
          <div className="absolute top-6 left-6 z-10">
            <Link
              href="/travel"
              className="inline-flex items-center gap-2 bg-[#0e0e0e]/70 backdrop-blur-sm hover:bg-[#0e0e0e]/90 border border-white/15 text-white rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Destinations
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
        </div>
      </div>

      {/* Spacer */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* ── RIGHT — Scrollable content ───────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[#0e0e0e]">

        {/* Sticky sub-header */}
        <div className="sticky top-16 z-20 bg-[#0e0e0e]/95 backdrop-blur-sm border-b border-white/8 px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">Destination</p>
            <h2 className="text-white font-black text-lg leading-tight">{data.city}</h2>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">Photos</p>
            <p className="text-red-500 font-black text-lg leading-tight">{data.photos.length}</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 divide-x divide-white/8 border-b border-white/8">
          {[
            { icon: Globe, label: "Country", value: data.country },
            { icon: MapPin, label: "City", value: data.city },
            { icon: Calendar, label: "Year", value: year ? String(year) : "—" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center justify-center py-6 px-4 gap-1">
              <Icon className="w-4 h-4 text-red-500/70 mb-1" />
              <span className="text-white font-bold text-sm truncate max-w-full text-center">{value}</span>
              <span className="text-white/30 text-[10px] uppercase tracking-wider font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        {data.description && (
          <div className="px-8 py-8 border-b border-white/8">
            <p className="text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">About this place</p>
            <p className="text-white/70 leading-relaxed text-sm">{data.description}</p>
          </div>
        )}

        {/* Photo feed */}
        <div className="flex-1 px-6 py-6">
          <p className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
            {data.photos.length} shots from {data.city}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.photos.map((photo, index) => (
              <Link
                href={`/p/${photo.id}`}
                key={photo.id}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-xl bg-[#141414] border border-white/8 group-hover:border-red-500/40 transition-all duration-300 aspect-square">
                  <BlurImage
                    src={keyToUrl(photo.url)}
                    alt={photo.title}
                    fill
                    blurhash={photo.blurData || ""}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover overlay with title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/90 via-[#0e0e0e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white font-bold text-xs leading-tight line-clamp-2">
                      {photo.title}
                    </p>
                    {photo.dateTimeOriginal && (
                      <p className="text-white/50 text-[10px] mt-0.5 font-medium">
                        {format(photo.dateTimeOriginal, "d MMM yyyy")}
                      </p>
                    )}
                  </div>
                  {/* Index badge */}
                  <div className="absolute top-2 right-2 bg-[#0e0e0e]/60 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-white/70 text-[9px] font-black">
                      {index + 1}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};
