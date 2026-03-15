import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Camera,
  Compass,
  MapPin,
  Star,
  Users,
} from "lucide-react";

import Footer from "@/components/footer";

const DISCOVER_TRIPS = [
  {
    id: "iceland-001",
    title: "冰島：極光與孤島靈魂",
    subtitle: "熬夜等天光、沿著黑沙海岸拍到凌晨，屬於冷冽派旅人的冒險版本。",
    image:
      "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=1470&auto=format&fit=crop",
    location: "冰島, 雷克雅未克",
    duration: "10 Days",
    price: "8,800",
    season: "Jan - Mar",
    tags: ["極光獵人", "黑沙海灘", "電影感構圖"],
    features: ["攝影指導", "小團互動", "野性探險"],
    accent: "from-cyan-400/30 via-sky-500/10 to-transparent",
  },
  {
    id: "japan-002",
    title: "京都：櫻花祭暗光美學",
    subtitle: "夜色、巷弄與蒸汽食堂交錯，專為喜歡慢節奏掃街的人設計。",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200",
    location: "日本, 京都",
    duration: "6 Days",
    price: "3,200",
    season: "Mar - Apr",
    tags: ["深夜掃街", "櫻花檔期", "底片氛圍"],
    features: ["城市漫遊", "在地美食", "人文觀察"],
    accent: "from-pink-400/30 via-red-500/10 to-transparent",
  },
  {
    id: "morocco-003",
    title: "摩洛哥：撒哈拉色彩實驗室",
    subtitle: "走進高彩度巷弄與沙漠光影，把旅程拍成一整本時尚誌。",
    image:
      "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    location: "摩洛哥, 舍夫沙萬",
    duration: "8 Days",
    price: "5,500",
    season: "Sep - Nov",
    tags: ["異域建築", "沙漠探險", "人像大片"],
    features: ["風格拍攝", "色彩策展", "公路旅行"],
    accent: "from-amber-300/30 via-orange-500/10 to-transparent",
  },
];

const DISCOVER_NOTES = [
  {
    title: "不是跟團，是一起出走",
    text: "把行程做輕，把畫面做滿，保留足夠時間讓你和城市真的發生關係。",
    icon: Users,
  },
  {
    title: "每站都有鏡頭語言",
    text: "從取景、穿搭節奏到黃金時段安排，整趟旅程都圍繞照片的完成度。",
    icon: Camera,
  },
  {
    title: "年輕感來自流動感",
    text: "不只打卡經典景點，我們更在意沿路發現的咖啡店、巷子與偶遇。",
    icon: Compass,
  },
];

export const metadata: Metadata = {
  title: "Discover — Snaptogoclub",
  description: "用更年輕的方式規劃旅拍路線，從城市靈感到冒險風景，找到你的下一站。",
};

export const page = () => {
  const featuredTrip = DISCOVER_TRIPS[0];

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-red-500/30">
      <section className="relative isolate overflow-hidden px-4 pb-10 pt-6 sm:px-8 lg:px-12 lg:pb-16 lg:pt-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_24%),linear-gradient(180deg,#131313_0%,#080808_60%)]" />
        <div className="absolute inset-x-0 top-10 mx-auto h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-8 sm:px-8 sm:py-10 lg:min-h-[78vh] lg:px-10 lg:py-12">
            <div className="absolute inset-0">
              <Image
                src={featuredTrip.image}
                alt={featuredTrip.title}
                fill
                priority
                className="object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,8,8,0.18),rgba(8,8,8,0.82)_55%,rgba(8,8,8,0.96))]" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.32em] text-white/80 backdrop-blur-sm">
                  Discover Next Trip
                </span>

                <div className="max-w-2xl space-y-5">
                  <h1 className="text-5xl font-black tracking-[-0.06em] text-white sm:text-6xl lg:text-8xl lg:leading-[0.9]">
                    年輕一點
                    <br />
                    去更遠的地方
                  </h1>
                  <p className="max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                    Discover 不是傳統行程列表，而是帶著相機、朋友和衝動出發的靈感牆。每條路線都兼顧拍攝節奏、城市空氣與一點不按牌理的冒險感。
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="#route-moodboard"
                    className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-bold tracking-[0.2em] text-white uppercase transition-colors hover:bg-red-400"
                  >
                    Explore Routes <ArrowRight size={14} />
                  </a>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-bold tracking-[0.2em] text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/15"
                  >
                    Our Travel Style
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { label: "Small Groups", value: "6-10 人" },
                  { label: "Photo-Led", value: "100% 節奏策劃" },
                  { label: "Best Season", value: featuredTrip.season },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4 backdrop-blur-sm"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/45">
                      {item.label}
                    </p>
                    <p className="mt-2 text-lg font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#121212] p-6 sm:p-7">
              <div className={`absolute inset-0 bg-gradient-to-br ${featuredTrip.accent}`} />
              <div className="relative z-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
                      Featured Escape
                    </p>
                    <h2 className="mt-3 text-2xl font-black tracking-tight">
                      {featuredTrip.title}
                    </h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                    {featuredTrip.duration}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-white/55">
                    <MapPin size={14} className="text-red-400" />
                    {featuredTrip.location}
                  </div>
                  <p className="max-w-md text-sm leading-7 text-white/65">
                    {featuredTrip.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {featuredTrip.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white/75 uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">
                      From
                    </p>
                    <p className="mt-2 text-3xl font-black text-white">${featuredTrip.price}</p>
                  </div>
                  <Link
                    href="/travel"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-white transition-colors hover:text-red-400"
                  >
                    See Gallery <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {DISCOVER_NOTES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] p-5 transition-colors hover:border-red-500/35 hover:bg-white/[0.05]"
                >
                  <item.icon size={18} className="text-red-400" />
                  <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="route-moodboard" className="px-4 pb-16 sm:px-8 lg:px-12 lg:pb-20 scroll-mt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.32em] text-red-400">
                Route Moodboard
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                像翻旅遊雜誌一樣選你的下一站
              </h2>
            </div>
            <Link
              href="/travel"
              className="inline-flex items-center gap-2 self-start border-b border-white/20 pb-1 text-xs font-black uppercase tracking-[0.24em] text-white transition-colors hover:border-red-400 hover:text-red-400"
            >
              Browse All Cities <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {DISCOVER_TRIPS.map((trip) => (
              <article
                key={trip.id}
                className="group overflow-hidden rounded-[2rem] border border-white/8 bg-[#111] transition-all duration-500 hover:-translate-y-1 hover:border-red-500/35"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={trip.image}
                    alt={trip.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {trip.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/50">
                        From
                      </p>
                      <p className="mt-1 text-2xl font-black text-white">${trip.price}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/75 backdrop-blur-sm">
                      {trip.season}
                    </span>
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={12} className="text-red-400" />
                      {trip.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={12} className="text-red-400" />
                      {trip.duration}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white transition-colors group-hover:text-red-400">
                      {trip.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-white/50">{trip.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-white/8 pt-4">
                    {trip.features.map((feature, index) => {
                      const Icon = index === 0 ? Camera : index === 1 ? Users : Star;

                      return (
                        <span
                          key={feature}
                          className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/70"
                        >
                          <Icon size={12} className="text-red-400" />
                          {feature}
                        </span>
                      );
                    })}
                  </div>

                  <Link
                    href="/travel"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-white transition-colors hover:text-red-400"
                  >
                    Explore This Mood <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default page;