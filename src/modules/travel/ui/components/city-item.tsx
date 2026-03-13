import Link from "next/link";
import { Camera } from "lucide-react";
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
        className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${
          isActive ? "ring-2 ring-red-500" : "ring-1 ring-white/8 hover:ring-red-500/40"
        }`}
        onMouseEnter={() => onMouseEnter(city)}
      >
        {/* Big image */}
        <div className="relative w-full aspect-square overflow-hidden">
          <BlurImage
            src={keyToUrl(city.coverPhoto.url)}
            alt={city.city}
            fill
            blurhash={city.coverPhoto.blurData}
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-cover object-center origin-center group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/80 via-transparent to-transparent" />

          {/* Active indicator */}
          {isActive && (
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500" />
          )}

          {/* Bottom text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white font-black text-base uppercase leading-tight tracking-tight truncate">
              {city.city}
            </p>
            <p className="text-white/50 text-xs font-medium mt-0.5 truncate">
              {city.country}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <Camera className="w-3 h-3 text-red-500/80" />
              <span className="text-[10px] text-white/35 font-medium">
                {city.photoCount} photos
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
