"use client";

import { useRouter } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { type Photo } from "@/db/schema";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { MapPin, Image as ImageIcon, ArrowRight } from "lucide-react";

interface Props {
  title: string;
  coverPhoto: Photo;
  country?: string;
  photoCount?: number;
}

const CityCard = ({ title, coverPhoto, country, photoCount = 0 }: Props) => {
  const router = useRouter();

  return (
    <div
      className="group relative w-full h-72 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-red-100/50 transition-all duration-300"
      onClick={() => router.push(`/travel/${title}`)}
    >
      {/* Background Image */}
      <BlurImage
        src={keyToUrl(coverPhoto.url)}
        alt={coverPhoto.title}
        fill
        sizes="(max-width: 767px) 100vw, (max-width: 1535px) 50vw, 33vw"
        quality={75}
        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        blurhash={coverPhoto.blurData}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-between p-5">
        {/* Top - Photo Count Badge */}
        {photoCount > 0 && (
          <div className="flex justify-end">
            <div className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{photoCount}</span>
            </div>
          </div>
        )}

        {/* Bottom - City Info */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              {country && (
                <p className="text-xs text-white/70 font-medium uppercase tracking-wider">{country}</p>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white leading-tight">
              {title}
            </h3>
          </div>
          
          {/* Hover Action */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="text-sm font-semibold text-red-400">Explore</span>
            <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
