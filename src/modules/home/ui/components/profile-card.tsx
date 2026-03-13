"use client";

import Link from "next/link";
import { ArrowUpRight, Instagram, MessageCircle, MapPin, Camera, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileCard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
      {/* ── 主個人卡片 (佔 3 欄) ── */}
      <div className="col-span-1 md:col-span-3">
        <Link
          href="/about"
          className="relative overflow-hidden rounded-[2rem] group cursor-pointer h-full block border border-white/5 bg-[#0a0a0a]"
        >
          {/* 背景裝飾：淺紅色柔光 */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] group-hover:bg-rose-500/10 transition-colors duration-500" />
          
          <div className="relative flex flex-col justify-between p-8 lg:p-12 h-full min-h-[320px]">
            {/* 頂部：身份標識 */}
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative">
                <Avatar className="size-20 lg:size-24 border border-white/10 p-1 bg-white/5 shadow-2xl">
                  <AvatarImage src="/snapandgo.png" alt="Snaptogoclub" className="rounded-full object-cover" />
                  <AvatarFallback className="bg-zinc-900 text-white">SG</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-rose-500 rounded-full p-2 shadow-lg border-2 border-[#0a0a0a]">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl lg:text-4xl font-light tracking-tighter text-white">
                    Snaptogo<span className="font-medium text-rose-400">club</span>
                  </h1>
                  <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <ArrowUpRight className="w-5 h-5 text-white/40" />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/40 text-[10px] font-light tracking-[0.2em] uppercase">
                  <span className="flex items-center gap-1.5"><Globe className="w-3 h-3" /> 旅遊攝影</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> 全球旅跡</span>
                </div>
              </div>
            </div>

            {/* 中間：品牌精神 */}
            <div className="mt-10 space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight leading-tight text-white tracking-tight">
                旅行 <span className="text-white/20">/</span> 攝影 <span className="text-white/20">/</span> 社交
              </h2>
              <p className="text-white/40 font-light tracking-[0.15em] text-sm md:text-base max-w-md">
                我們一起旅行，一起創作，在鏡頭中萃取世界的每個瞬間。
              </p>
            </div>

            {/* 底部：裝飾與年份 */}
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase font-light">Established 2025</span>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-rose-500/40" />
                ))}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* ── 側邊卡片 (佔 1 欄) ── */}
      <div className="col-span-1 flex flex-col gap-4">
        
        {/* Instagram */}
        <Link
          href="https://www.instagram.com/gess.tue/"
          target="_blank"
          className="group relative overflow-hidden rounded-[2rem] p-8 h-full bg-[#111111] border border-white/5 hover:border-rose-500/30 transition-all duration-500"
        >
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-rose-500 transition-colors duration-500">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mb-1">追蹤我們</p>
              <h3 className="text-lg font-medium text-white">Instagram</h3>
            </div>
          </div>
        </Link>

        {/* WhatsApp - 淺紅色主題 */}
        <Link
          href="https://wa.me/YOUR_PHONE_NUMBER"
          target="_blank"
          className="group relative overflow-hidden rounded-[2rem] p-8 h-full bg-rose-500 hover:bg-rose-400 transition-all duration-500 shadow-lg shadow-rose-500/10"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <MessageCircle className="w-16 h-16 -mr-6 -mt-6 rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between text-white">
            <div className="size-12 rounded-2xl bg-black/10 flex items-center justify-center border border-white/10">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase mb-1">即時對話</p>
              <h3 className="text-lg font-medium">與我聯絡</h3>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;