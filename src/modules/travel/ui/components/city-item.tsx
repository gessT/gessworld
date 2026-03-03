import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import BlurImage from "@/components/blur-image";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { CitySetWithPhotos } from "@/db/schema";

interface CityItemProps {
  city: CitySetWithPhotos;
  activeId: string;
  onMouseEnter: (city: CitySetWithPhotos) => void;
}

export const CityItem = ({ city, activeId, onMouseEnter }: CityItemProps) => {
  const isActive = city.id === activeId;

  return (
    <Link href={`/travel/${encodeURIComponent(city.city)}`} className="block group">
      <div
        className={`relative flex items-center gap-5 px-8 py-5 cursor-pointer transition-all duration-200 ${
          isActive
            ? "bg-white/5 border-l-2 border-red-500"
            : "border-l-2 border-transparent hover:bg-white/[0.03] hover:border-red-500/40"
        }`}
        onMouseEnter={() => onMouseEnter(city)}
      >
        {/* Thumbnail */}
        <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-red-500/30 transition-all duration-200">
          <BlurImage
            src={keyToUrl(city.coverPhoto.url)}
            alt={city.city}
            fill
            blurhash={city.coverPhoto.blurData}
            sizes="64px"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Active shimmer */}
          {isActive && (
            <div className="absolute inset-0 ring-2 ring-inset ring-red-500/60 rounded-xl" />
          )}
        </div>

        {/* Text info */}
        <div className="flex-1 min-w-0">
          <p
            className={`font-bold text-base leading-tight truncate transition-colors duration-200 ${
              isActive ? "text-white" : "text-white/70 group-hover:text-white"
            }`}
          >
            {city.city}
          </p>
          <p className="text-white/35 text-sm mt-0.5 truncate font-medium">
            {city.country}
          </p>
          <div className="flex items-center gap-1 mt-1.5">
            <Camera className="w-3 h-3 text-red-500/70" />
            <span className="text-[11px] text-white/30 font-medium">
              {city.photoCount} photos
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div
          className={`flex-shrink-0 transition-all duration-200 ${
            isActive
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          }`}
        >
          <ArrowRight className="w-4 h-4 text-red-500" />
        </div>
      </div>
    </Link>
  );
};
