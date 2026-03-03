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
    "We travel. We shoot. We tell stories. Discover the journey behind Snaptogoclub.",
};

const stats = [
  { value: "100+", label: "Destinations", icon: MapPin },
  { value: "500+", label: "Photos Captured", icon: Camera },
  { value: "50K", label: "Community", icon: Users },
  { value: "4.9", label: "Average Rating", icon: Star },
];

const values = [
  {
    icon: Globe,
    title: "Explore Without Limits",
    desc: "Every border is an invitation. We chase light across continents, from neon-lit alleys to untouched wilderness.",
  },
  {
    icon: Camera,
    title: "Capture the Real",
    desc: "Not posed. Not filtered. We document the raw, unscripted moments that only travel can create.",
  },
  {
    icon: Heart,
    title: "Travel with Soul",
    desc: "We move slow, connect deep, and leave each place better — keeping memories, not footprints.",
  },
  {
    icon: Compass,
    title: "Your Story, Not Ours",
    desc: "Every trip is personal. We craft each experience around you — your pace, your vision, your adventure.",
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
            Our Story
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-6">
            We Live
            <br />
            <span className="text-red-500">to Travel.</span>
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-xl leading-relaxed">
            Snaptogoclub is not a tour company. We are a movement — a tribe of
            young explorers who believe every journey deserves to be remembered
            beautifully.
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
                Who we are
              </span>
              <h2 className="text-4xl sm:text-5xl font-black mt-3 leading-tight">
                Born on the road.
                <br />
                <span className="text-white/40">Built for wanderers.</span>
              </h2>
            </div>
            <div className="space-y-5 text-white/60 text-base leading-relaxed">
              <p>
                Snaptogoclub started with a camera, a one-way ticket, and a
                question:{" "}
                <em className="text-white/90 not-italic font-semibold">
                  "What if we could make every journey look and feel as good as
                  it actually was?"
                </em>
              </p>
              <p>
                We are not guides. We are{" "}
                <span className="text-white font-semibold">
                  travel companions, visual storytellers, and co-creators
                </span>{" "}
                — walking alongside you, lens in hand, letting the real moments
                unfold naturally.
              </p>
              <p>
                Whether it is a couple chasing golden hour, a squad hunting for
                the next hidden gem, or a solo traveller ready to find
                themselves — Snaptogoclub is your reason to go and your way to
                remember it.
              </p>
            </div>
            <Link
              href="/travel"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-7 py-3.5 rounded-full transition-colors text-sm tracking-wide"
            >
              See our journeys <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Image collage */}
          <div className="relative h-[500px] hidden lg:block">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div
                className="w-full h-full bg-[url(/aboutbg.png)] bg-cover bg-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/60 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 rounded-xl p-2.5">
                  <Camera className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">500+</p>
                  <p className="text-white/50 text-xs mt-1">Stories told</p>
                </div>
              </div>
            </div>
            {/* Floating badge 2 */}
            <div className="absolute -top-6 -right-6 bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 rounded-xl p-2.5">
                  <MapPin className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg leading-none">100+</p>
                  <p className="text-white/50 text-xs mt-1">Destinations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL BLEED QUOTE ───────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url(/aboutbg.png)] bg-cover bg-center bg-fixed opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e] via-transparent to-[#0e0e0e]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 text-center">
          <p className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
            &ldquo;带着镜头走，
            <span className="text-red-500">带着故事回家</span>
            。&rdquo;
          </p>
          <p className="text-white/40 mt-6 text-base tracking-widest uppercase font-medium">
            Leave with a lens. Come back with a story.
          </p>
        </div>
      </section>

      {/* ── VALUES BENTO GRID ──────────────────────────────────────── */}
      <section className="px-6 sm:px-12 lg:px-20 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase">
            What drives us
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mt-3">
            Our <span className="text-white/40">Principles</span>
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

      {/* ── CTA SECTION ────────────────────────────────────────────── */}
      <section className="px-6 sm:px-12 lg:px-20 pb-24 max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-red-600/20 to-red-900/10 border border-red-500/20 rounded-3xl p-12 sm:p-16 overflow-hidden text-center">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-5 bg-[url(/aboutbg.png)] bg-cover bg-center rounded-3xl" />
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              Ready to start your story?
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of travellers who chose to experience the world
              differently — with Snaptogoclub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/travel"
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-full transition-colors text-sm tracking-wide"
              >
                Explore Journeys <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full transition-colors text-sm tracking-wide border border-white/20"
              >
                Discover Photos
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
