import CardContainer from "@/components/card-container";
import { User } from "lucide-react";

const AboutCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-8 md:p-12 gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-red-50 dark:bg-red-500/10 p-2.5 rounded-xl">
            <User className="w-6 h-6 text-red-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">About</h1>
        </div>
        <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed">
          <p>
            With a focus on both candid moments and stunning landscapes, I
            strive to evoke emotion and tell stories through my work. My
            photography blends the rawness of everyday life with the artistry of
            fine art, allowing viewers to connect with each image on a deeper
            level.
          </p>

          <p>
            Whether I&apos;m exploring urban environments or venturing into
            nature, my goal is to highlight the extraordinary in the ordinary.
            Through my lens, I invite you to join me on this visual journey of
            discovery and inspiration.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default AboutCard;
