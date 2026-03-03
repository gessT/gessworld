import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

const LatestTravelCard = () => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-red-50 dark:bg-red-500/10 p-2.5 rounded-xl">
          <Compass className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-sm">Latest Travel Stories</p>
          <p className="text-xs text-muted-foreground">Explore new destinations and photo collections</p>
        </div>
      </div>

      <Link
        href="/travel"
        className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors group"
      >
        View All
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
};

export default LatestTravelCard;
