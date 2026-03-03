"use client";

import { useRouter } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { type Photo } from "@/db/schema";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { MapPin, Image as ImageIcon } from "lucide-react";

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
      className="group relative w-full h-64 rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => router.push(`/travel/${title}`)}
    >
      {/* Background Image */}
      <BlurImage
        src={keyToUrl(coverPhoto.url)}
        alt={coverPhoto.title}
        fill
        sizes="(max-width: 767px) 100vw, (max-width: 1535px) 50vw, 33vw"
        quality={75}
        className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        blurhash={coverPhoto.blurData}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />

      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6">
        {/* Top - Photo Count */}
        {photoCount > 0 && (
          <div className="flex justify-end">
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-sm font-medium">
              <ImageIcon className="w-4 h-4" />
              <span>{photoCount}</span>
            </div>
          </div>
        )}

        {/* Bottom - City Info */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {title}
              </h3>
              {country && (
                <p className="text-sm text-gray-200 mt-1">{country}</p>
              )}
            </div>
          </div>
          
          {/* Hover Action Button */}
          <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
            <button className="w-full bg-white text-black py-2 px-4 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors duration-200">
              Explore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
