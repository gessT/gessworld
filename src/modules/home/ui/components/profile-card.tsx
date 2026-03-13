// External dependencies
import Link from "next/link";

// Internal dependencies - UI Components
import { ArrowUpRight, Instagram, Mail, MapPin, Camera, Globe, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
      {/* Main Profile Card */}
      <div className="col-span-1 md:col-span-2">
        <Link
          href="/about"
          className="relative overflow-hidden rounded-2xl group cursor-pointer h-full block"
        >
          {/* Background Gradient - Red theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-rose-500 to-red-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-400/20 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative flex flex-col justify-between p-8 lg:p-10 h-full text-white min-h-[280px]">
            {/* Top */}
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 items-start">
                  <div className="relative">
                    <Avatar className="size-[72px] border-[3px] border-white/40 shadow-xl">
                      <AvatarImage src="/snapandgo.png" alt="Avatar" />
                      <AvatarFallback className="bg-red-700 text-white text-xl">SG</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full p-1.5 shadow-lg">
                      <Camera className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="pt-1">
                    <h1 className="text-2xl font-bold tracking-tight">Snaptogoclub</h1>
                    <p className="text-white/80 text-sm font-medium flex items-center gap-1.5 mt-0.5">
                      <Globe className="w-3.5 h-3.5" />
                      Travel Photographer
                    </p>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

               <div className="mt-5 text-base sm:text-lg md:text-xl text-white/75 max-w-lg leading-relaxed font-medium drop-shadow text-center">
              <p className="text-4xl md:text-5xl font-semibold tracking-wide leading-tight text-white">
                旅行 × 攝影 × 社交
              </p>
              <p className="text-lg text-white/60 leading-relaxed font-light mt-3">
                我們一起旅行，一起創作，一起記錄世界。
              </p>
            </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-6 mt-auto border-t border-white/20">
              {/* <div>
                <p className="text-2xl font-bold">100+</p>
                <p className="text-white/60 text-xs">Destinations</p>
              </div>
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-white/60 text-xs">Photos</p>
              </div>
              <div>
                <p className="text-2xl font-bold">50K</p>
                <p className="text-white/60 text-xs">Followers</p>
              </div> */}
            </div>
          </div>
        </Link>
      </div>

      {/* Contact Cards */}
      <div className="col-span-1 flex flex-col gap-4">
        {/* Instagram Card */}
        <Link
          href="https://www.instagram.com/gess.tue/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-2xl p-6 h-full bg-gradient-to-br from-red-400 to-rose-500 hover:shadow-xl hover:shadow-red-200/30 transition-all duration-300 cursor-pointer hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-white/5 group-hover:bg-white/15 transition-colors duration-300" />
          <div className="relative flex flex-col h-full justify-between text-white">
            <div>
              <Instagram className="w-6 h-6 mb-3" />
              <h3 className="text-lg font-bold">Instagram</h3>
            </div>
            <p className="text-sm text-white/80">Snap To Go</p>
          </div>
        </Link>

        {/* Contact Me Card */}
        <Link
          href="mailto:lianshiliang93@gmail.com"
          className="group relative overflow-hidden rounded-2xl p-6 h-full bg-gradient-to-br from-rose-600 to-red-700 hover:shadow-xl hover:shadow-red-200/30 transition-all duration-300 cursor-pointer hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-white/5 group-hover:bg-white/15 transition-colors duration-300" />
          <div className="relative flex flex-col h-full justify-between text-white">
            <div>
              <Mail className="w-6 h-6 mb-3" />
              <h3 className="text-lg font-bold">Get in Touch</h3>
            </div>
            <p className="text-sm text-white/80">Let&apos;s collaborate</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
