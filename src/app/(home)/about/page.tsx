// External dependencies
import { type Metadata } from "next";

// Internal dependencies - UI Components
import Footer from "@/components/footer";
import AboutCard from "../../../modules/home/ui/components/about-card";
import ProfileCard from "../../../modules/home/ui/components/profile-card";
import VectorCombined from "@/components/vector-combined";

export const metadata: Metadata = {
  title: "About",
  description: "About page",
};

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-3 lg:gap-0 lg:flex-row w-full pt-16">
      {/* LEFT CONTENT - Fixed */}
      <div className="w-full h-[70vh] lg:w-1/2 lg:fixed lg:top-0 lg:left-0 lg:h-screen p-0 lg:p-3">
        <div className="w-full h-full relative bg-[url(/bg.jpg)] bg-top bg-cover rounded-xl">
          <div className="absolute right-0 bottom-0">
            <VectorCombined title="About" position="bottom-right" />
          </div>
        </div>
      </div>

      {/* Spacer for fixed left content */}
      <div className="hidden lg:block lg:w-1/2" />

      {/* RIGHT CONTENT - Scrollable */}
      <div className="w-full lg:w-1/2 space-y-4 pb-3 px-3 lg:px-0">
        {/* PROFILE CARD  */}
        <ProfileCard />

        {/* ABOUT CARD  */}
        <AboutCard />

        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
