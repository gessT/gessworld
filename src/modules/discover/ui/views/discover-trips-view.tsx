"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  Camera,
  Compass,
  MapPin,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import Footer from "@/components/footer";
import { WHATSAPP_NUMBER } from "@/constants";

const ICON_MAP: Record<string, React.ElementType> = {
  camera: Camera,
  users: Users,
  star: Star,
  compass: Compass,
  "map-pin": MapPin,
};

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

function fmtDate(d: Date | string | null | undefined) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildWhatsAppUrl(
  tripTitle: string,
  departureLabel?: string | null,
  start?: Date | string | null,
  end?: Date | string | null
) {
  const dateStr =
    start && end
      ? ` — ${departureLabel ? departureLabel + ": " : ""}${fmtDate(start)} → ${fmtDate(end)}`
      : "";
  const text = `Hi! I'm interested in the "${tripTitle}" trip${dateStr}. Could you please send me more information? 🙏`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export const DiscoverTripsView = () => {
  const trpc = useTRPC();
  const { data: tripList } = useSuspenseQuery(
    trpc.discover.getManyTrips.queryOptions()
  );

  // selectedDeparture[tripId] = index of selected departure (or null)
  const [selectedDeparture, setSelectedDeparture] = useState<Record<string, number | null>>({});

  const featuredTrip = tripList[0] ?? null;

  const formatPrice = (cents: number) =>
    (cents / 100).toLocaleString("en-US");

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-red-500/30">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden px-4 pb-5 pt-4 sm:px-8 lg:px-12 lg:pb-8 lg:pt-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_24%),linear-gradient(180deg,#131313_0%,#080808_60%)]" />
        <div className="absolute inset-x-0 top-10 mx-auto h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          {/* Hero left card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-6 sm:px-8 sm:py-7 lg:min-h-[40vh] lg:px-10 lg:py-8">
            <div className="absolute inset-0">
              <Image
                src="/discoveryhero.png"
                alt="Discover hero"
                fill
                priority
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,8,8,0.10),rgba(8,8,8,0.65)_55%,rgba(8,8,8,0.90))]" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.32em] text-white/80 backdrop-blur-sm">
                  Discover Next Trip
                </span>

                <div className="max-w-2xl space-y-5">
                  <h1 className="text-3xl font-black tracking-[-0.06em] text-white sm:text-4xl lg:text-5xl lg:leading-[0.95]">
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

              <div className="grid gap-2 md:grid-cols-3">
                {[
                  { label: "Small Groups", value: `${featuredTrip?.minGroupSize ?? 6}-${featuredTrip?.maxGroupSize ?? 10} 人` },
                  { label: "Photo-Led", value: "100% 節奏策劃" },
                  { label: "Best Season", value: featuredTrip?.bestSeasonLabel ?? "—" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 backdrop-blur-sm"
                  >
                    <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/45">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hero right column */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {featuredTrip && (
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#121212] p-6 sm:p-7">
                {/* Cover photo background */}
                {featuredTrip.coverPhoto ? (
                  <>
                    <Image
                      src={featuredTrip.coverPhoto.url}
                      alt={featuredTrip.title}
                      fill
                      className="object-cover opacity-30"
                      placeholder={featuredTrip.coverPhoto.blurData ? "blur" : undefined}
                      blurDataURL={featuredTrip.coverPhoto.blurData ?? undefined}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(8,8,8,0.15),rgba(8,8,8,0.80)_50%,rgba(8,8,8,0.97))]" />
                  </>
                ) : featuredTrip.accentGradient ? (
                  <div className={`absolute inset-0 bg-gradient-to-br ${featuredTrip.accentGradient}`} />
                ) : null}
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
                      {featuredTrip.durationDays} Days
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-white/55">
                      <MapPin size={14} className="text-red-400" />
                      {featuredTrip.locationLabel}
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
                      <p className="mt-2 text-3xl font-black text-white">
                        ${formatPrice(featuredTrip.priceUsd)}
                      </p>
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
            )}

            <div className="flex flex-col gap-2">
              {DISCOVER_NOTES.map((item, i) => {
                const scales = [
                  { px: "px-4 py-3", icon: 15, title: "text-sm", text: "text-xs", opacity: "opacity-100" },
                  { px: "px-3 py-2.5", icon: 13, title: "text-[13px]", text: "text-[11px]", opacity: "opacity-90" },
                  { px: "px-3 py-2", icon: 11, title: "text-xs", text: "text-[10px]", opacity: "opacity-75" },
                ];
                const s = scales[i] ?? scales[2];
                return (
                  <div
                    key={item.title}
                    className={`flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] ${s.px} ${s.opacity} transition-colors hover:border-red-500/30 hover:bg-white/[0.05]`}
                  >
                    <div className="mt-0.5 shrink-0 rounded-md bg-red-500/15 p-1.5">
                      <item.icon size={s.icon} className="text-red-400" />
                    </div>
                    <div className="min-w-0">
                      <p className={`${s.title} font-bold text-white leading-snug`}>{item.title}</p>
                      <p className={`${s.text} text-white/45 leading-relaxed mt-0.5 line-clamp-2`}>{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRIP GRID ─────────────────────────────────────────────────────── */}
      <section id="route-moodboard" className="scroll-mt-8 px-4 pb-16 sm:px-8 lg:px-12 lg:pb-20">
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

          {tripList.length === 0 ? (
            <div className="py-20 text-center text-white/30 text-sm tracking-widest uppercase">
              No trips published yet — check back soon.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {tripList.map((trip) => {
                const selIdx = selectedDeparture[trip.id] ?? null;
                const selDep = selIdx !== null ? trip.departures[selIdx] : null;
                const hasSelected = selIdx !== null;
                const hasDepartures = trip.departures.length > 0;

                return (
                <article
                  key={trip.id}
                  className={`group overflow-hidden rounded-[2rem] border bg-[#111] transition-all duration-500 hover:-translate-y-1 ${
                    hasSelected
                      ? "border-red-500/70 shadow-[0_0_32px_rgba(239,68,68,0.18)]"
                      : "border-white/8 hover:border-red-500/35"
                  }`}
                >
                  <div className="relative h-72 overflow-hidden">
                    {trip.coverPhoto ? (
                      <Image
                        src={trip.coverPhoto.url}
                        alt={trip.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        placeholder={trip.coverPhoto.blurData ? "blur" : undefined}
                        blurDataURL={trip.coverPhoto.blurData ?? undefined}
                      />
                    ) : (
                      <div
                        className={`h-full w-full bg-gradient-to-br ${trip.accentGradient ?? "from-white/5 via-white/2 to-transparent"} bg-[#111]`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                          <MapPin size={64} strokeWidth={0.75} />
                        </div>
                      </div>
                    )}
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
                        <p className="mt-1 text-2xl font-black text-white">
                          ${formatPrice(trip.priceUsd)}
                        </p>
                      </div>
                      {trip.bestSeasonLabel && (
                        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/75 backdrop-blur-sm">
                          {trip.bestSeasonLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={12} className="text-red-400" />
                        {trip.locationLabel}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={12} className="text-red-400" />
                        {trip.durationDays} Days
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-white transition-colors group-hover:text-red-400">
                        {trip.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-white/50">{trip.subtitle}</p>
                    </div>

                    {trip.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 border-t border-white/8 pt-4">
                        {trip.features.map((feature) => {
                          const Icon = ICON_MAP[feature.iconKey ?? ""] ?? Star;
                          return (
                            <span
                              key={feature.label}
                              className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/70"
                            >
                              <Icon size={12} className="text-red-400" />
                              {feature.label}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* ── Date selection + WhatsApp CTA ── */}
                    <div className="border-t border-white/8 pt-4 space-y-3">
                      {/* Departure date pills */}
                      {hasDepartures && (
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
                            Choose Departure
                          </p>
                          <div className="flex flex-col gap-2">
                            {trip.departures.map((dep, idx) => {
                              const isSel = selIdx === idx;
                              const spotsLabel =
                                dep.spotsLeft != null
                                  ? dep.spotsLeft <= 3
                                    ? `${dep.spotsLeft} left!`
                                    : `${dep.spotsLeft} spots`
                                  : null;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() =>
                                    setSelectedDeparture((prev) => ({
                                      ...prev,
                                      [trip.id]: isSel ? null : idx,
                                    }))
                                  }
                                  className={`w-full flex items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all ${
                                    isSel
                                      ? "border-red-500/60 bg-red-500/10 text-white"
                                      : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/25 hover:text-white/90"
                                  }`}
                                >
                                  <div className="space-y-0.5">
                                    <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${isSel ? "text-red-300" : "text-white/40"}`}>
                                      {dep.label}
                                    </p>
                                    <p className="text-xs font-semibold">
                                      <Calendar size={10} className="inline mr-1 opacity-60" />
                                      {fmtDate(dep.startDate)} → {fmtDate(dep.endDate)}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    {spotsLabel && (
                                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                        dep.spotsLeft != null && dep.spotsLeft <= 3
                                          ? "bg-red-500/30 text-red-300"
                                          : "bg-white/10 text-white/50"
                                      }`}>
                                        {spotsLabel}
                                      </span>
                                    )}
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isSel ? "text-red-400" : "text-white/25"}`}>
                                      {isSel ? "✓" : "Select"}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* WhatsApp button */}
                      <div className="flex items-center gap-3">
                        <a
                          href={buildWhatsAppUrl(
                            trip.title,
                            selDep?.label,
                            selDep?.startDate,
                            selDep?.endDate
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black uppercase tracking-[0.2em] transition-all ${
                            hasSelected
                              ? "bg-[#25D366] text-white hover:bg-[#20bd5a]"
                              : "bg-white/[0.06] text-white/50 hover:bg-[#25D366]/80 hover:text-white"
                          }`}
                        >
                          <MessageCircle size={14} />
                          {hasSelected ? "WhatsApp Us" : "Enquire via WhatsApp"}
                        </a>
                        <Link
                          href="/travel"
                          className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-red-400"
                        >
                          Gallery <ArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export const DiscoverTripsViewSkeleton = () => (
  <div className="min-h-screen bg-[#080808] animate-pulse" />
);
