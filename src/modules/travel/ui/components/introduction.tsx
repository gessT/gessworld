import CardContainer from "@/components/card-container";
import { Compass } from "lucide-react";

export const Introduction = () => (
  <CardContainer>
    <div className="flex flex-col p-8 md:p-12 gap-8">
      <div className="flex items-center gap-3">
        <div className="bg-red-50 dark:bg-red-500/10 p-2.5 rounded-xl">
          <Compass className="w-6 h-6 text-red-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Travel</h1>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground leading-relaxed">
          Exploring the world one step at a time, capturing life through street
          photography and city walks. From bustling urban corners to hidden
          alleyways, every journey tells a unique story through the lens.
        </p>
      </div>
    </div>
  </CardContainer>
);
