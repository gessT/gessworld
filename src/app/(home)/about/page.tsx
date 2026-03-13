import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  MapPin,
  Users,
  Star,
  ArrowRight,
  Globe,
  Heart,
  Compass,
} from "lucide-react";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "About — Snaptogoclub",
  description:
    "記錄我走過的地方，用鏡頭捕捉世 界的每一個瞬間。",
};

const stats = [
  { value: "30+", label: "去過的城市", icon: MapPin },
  { value: "1000+", label: "拍攝照片", icon: Camera },
  { value: "50+", label: "旅行故事", icon: Users },
  { value: "∞", label: "未來旅程", icon: Star },
];

const values = [
  {
    icon: Globe,
    title: "看見世界",
    desc: "旅行讓我用不同的視角理解這個世界，每一個城市都是一段新的故事。",
  },
  {
    icon: Camera,
    title: "捕捉瞬間",
    desc: "透過鏡頭，我能把那些稍縱即逝的畫面留下來，變成永遠的記憶。",
  },
  {
    icon: Heart,
    title: "用心旅行",
    desc: "旅行不只是打卡景點，而是感受當地的生活與文化。",
  },
  {
    icon: Compass,
    title: "跟著好奇心走",
    desc: "很多最美的地方，往往不是計畫好的，而是在旅途中偶然遇見的。",
  },
];

const AboutPage = () => {
  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen">
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] flex items-end overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-[url(/aboutbg.png)] bg-cover bg-center scale-105"
          style={{ transformOrigin: "center" }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/80 via-transparent to-transparent" />

        {/* Hero text */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-20 pb-20 max-w-4xl">
          <span className="inline-block text-red-500 text-xs font-bold tracking-[0.25em] uppercase mb-4">
            我的旅程
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-6">
            我走過世界
            <br />
            <span className="text-red-500">用鏡頭記錄</span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-xl leading-relaxed">
            這是一個屬於我的旅行部落格。
            我用相機記錄走過的城市、看過的風景，以及旅途中那些稍縱即逝的瞬間。
            每一段旅程，都值得被記住。
          </p>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-[#141414]">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/10">
          {stats.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-2 py-10 px-6 group"
            >
              <Icon className="w-5 h-5 text-red-500 mb-1" />
              <span className="text-4xl sm:text-5xl font-black text-white">
                {value}
              </span>
              <span className="text-white/50 text-sm tracking-wide uppercase font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY SECTION ──────────────────────────────────────────── */}
      <section className="px-6 sm:px-12 lg:px-20 py-24 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="space-y-8">
            <div>
              <span className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase">
                關於我
              </span>
              <h2 className="text-4xl sm:text-5xl font-black mt-3 leading-tight">
                旅行開始於
                <br />
                <span className="text-white/40">一台相機與一份好奇心</span>
              </h2>
            </div>
            <div className="space-y-5 text-white/60 text-base leading-relaxed">
              <p>
                這個部落格的開始，其實很簡單。
                只是想把自己旅行過的地方、看過的風景，
                用照片和文字記錄下來。
              </p>
              <p>
                有些旅程是計畫好的，
                有些則是在旅途中偶然發現。
                從城市街道到寧靜小鎮，
                每一個地方都留下了一段回憶。
              </p>
              <p>
                在這裡，我分享我走過的路、
                看過的風景，以及透過鏡頭捕捉到的瞬間。
                希望這些故事，也能帶給你一點旅行的靈感。
              </p>
            </div>
            <Link
              href="/travel"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm tracking-wide"
            >
              查看我的旅程 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Image */}
          <div className="relative h-[500px] hidden lg:block">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div
                className="w-full h-full bg-[url(/aboutbg.png)] bg-cover bg-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/60 to-transparent" />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 rounded-xl p-2.5">
                  <Camera className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">1000+</p>
                  <p className="text-white/50 text-xs mt-1">照片故事</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 rounded-xl p-2.5">
                  <MapPin className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">30+</p>
                  <p className="text-white/50 text-xs mt-1">旅行地點</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUOTE ───────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url(/aboutbg.png)] bg-cover bg-center bg-fixed opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e] via-transparent to-[#0e0e0e]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <p className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
            「走過的路，
            <span className="text-red-500">都在鏡頭裡</span>
            。」
          </p>
          <p className="text-white/40 mt-6 text-base tracking-widest uppercase font-medium">
            Every road I walk becomes a story.
          </p>
        </div>
      </section>

      {/* ── VALUES ──────────────────────────────────────── */}
      <section className="px-6 sm:px-12 lg:px-20 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase">
            我的旅行理念
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3">
            旅行 <span className="text-white/40">與攝影</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#141414] border border-white/8 rounded-2xl p-7 group hover:border-red-500/40 hover:bg-[#1a1a1a] transition-all duration-300"
            >
              <div className="bg-red-500/10 group-hover:bg-red-500/20 rounded-xl p-3 w-fit mb-5 transition-colors">
                <Icon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2 leading-snug">
                {title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="px-6 sm:px-12 lg:px-20 pb-24 max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-red-600/20 to-red-900/10 border border-red-500/20 rounded-3xl p-12 sm:p-16 overflow-hidden text-center">
          <div className="absolute inset-0 opacity-5 bg-[url(/aboutbg.png)] bg-cover bg-center rounded-3xl" />
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              繼續探索世界
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              跟著我的旅行腳步，
              一起透過鏡頭看見世界。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/travel"
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-full transition-colors text-sm tracking-wide"
              >
                查看旅程 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full transition-colors text-sm tracking-wide border border-white/20"
              >
                瀏覽照片
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
