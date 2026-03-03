import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import TextScroll from "./text-scroll";
import { CitySetWithPhotos } from "@/db/schema";

interface CityItemProps {
  city: CitySetWithPhotos;
  onMouseEnter: (city: CitySetWithPhotos) => void;
}

export const CityItem = ({ city, onMouseEnter }: CityItemProps) => {
  return (
    <Link href={`/travel/${encodeURIComponent(city.city)}`} className="block">
      <div
        key={city.id}
        className="w-full py-4 px-4 bg-card hover:bg-red-50 dark:hover:bg-red-500/5 border border-border rounded-xl grid grid-cols-2 items-center cursor-pointer group transition-all duration-200 overflow-hidden hover:border-red-200 dark:hover:border-red-500/20"
        onMouseEnter={() => onMouseEnter(city)}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-red-400" />
          <p className="text-sm font-medium line-clamp-1">{city.city}</p>
        </div>
        <div className="relative overflow-hidden flex justify-end">
          <div className="flex items-center gap-2 transform transition-transform duration-200 ease-in-out group-hover:-translate-x-7">
            <span className="text-xs text-muted-foreground whitespace-nowrap text-right">
              <TextScroll className="w-28 lg:w-full">{city.country}</TextScroll>
            </span>
          </div>
          <div className="absolute right-0 transform translate-x-full transition-transform duration-200 ease-in-out group-hover:translate-x-0 flex items-center">
            <ArrowRight className="w-4 h-4 text-red-500" />
          </div>
        </div>
      </div>
    </Link>
  );
};
