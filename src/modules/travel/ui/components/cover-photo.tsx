import BlurImage from "@/components/blur-image";
import { CitySetWithPhotos } from "@/db/schema";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { Camera, MapPin } from "lucide-react";

interface CoverPhotoProps {
  citySet: CitySetWithPhotos;
  citySets: CitySetWithPhotos[];
}

export const CoverPhoto = ({ citySet, citySets }: CoverPhotoProps) => {
  return (
    <div className="w-full h-[30vh] md:h-[50vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen">
      <div className="w-full h-full relative overflow-hidden">
        {/* Photos — cross-fade transition */}
        {citySets?.map((city) => (
          <div
            key={city.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              city.id === citySet.id ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <BlurImage
              src={keyToUrl(city.coverPhoto.url)}
              alt={city.city}
              fill
              blurhash={city.coverPhoto.blurData}
              sizes="50vw"
              className="object-cover scale-105"
            />
          </div>
        ))}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/20 to-transparent z-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0e0e0e]/30 z-20" />

        {/* City info overlay */}
        <div className="absolute bottom-0 left-0 z-30 p-8 lg:p-10">
          {/* Active city label */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase">
              Now viewing
            </span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-white leading-none mb-1">
            {citySet.city}
          </h2>
          <p className="text-white/50 text-base font-medium flex items-center gap-1.5 mt-2">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            {citySet.country}
          </p>
          {/* Photo count badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5">
            <Camera className="w-3.5 h-3.5 text-red-400" />
            <span className="text-white text-xs font-semibold">
              {citySet.photoCount} Photos
            </span>
          </div>
        </div>

        {/* Top badge */}
        <div className="absolute top-6 left-6 z-30">
          <div className="bg-red-600/90 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-[10px] font-black tracking-widest uppercase">
              Jiotriplah
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
