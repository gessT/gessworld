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
  Quote,
  Instagram,
  Send,
} from "lucide-react";
import Footer from "@/components/footer";
import { appRouter } from "@/trpc/routers/_app";
import { createTRPCContext, createCallerFactory } from "@/trpc/init";

const createCaller = createCallerFactory(appRouter);

export const metadata: Metadata = {
  title: "About — Snaptogoclub",
  description: "捕捉瞬息萬變的世界，將回憶定格成永恆。",
};

const AboutPage = async () => {
  const ctx = await createTRPCContext();
  const caller = createCaller(ctx);
  const { cityCount, photoCount, postCount } = await caller.home.getStats();

  return (
    <div className="bg-[#080808] text-white min-h-screen font-sans selection:bg-red-500/30">
      
      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative h-[65vh] flex items-center px-6 sm:px-12 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/aboutbg.png" alt="Travel" fill className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <span className="inline-block text-red-500 text-[10px] font-black tracking-[0.3em] uppercase mb-4 px-2 py-1 border border-red-500/20 bg-red-500/5 rounded">
            Since 2024 • Travel & Visuals
          </span>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
            走過世界 <br />
            <span className="text-red-500">記錄瞬息</span>
          </h1>
          <p className="text-white/50 text-base max-w-lg leading-relaxed">
            這是一個關於探索、快門與故事的集合。我用相機捕捉城市與自然的呼吸，分享那些最真實、不被排練過的旅行瞬間。
          </p>
        </div>
      </section>

      {/* ── BENTO GRID WITH CARD BG IMAGES ─────────────────────────── */}
      <section className="px-4 sm:px-12 py-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 max-w-7xl mx-auto">
          
          {/* Main Identity Card (Large) */}
          <div className="md:col-span-2 relative group overflow-hidden bg-[#111] border border-white/10 rounded-3xl p-8 min-h-[300px] flex flex-col justify-end">
            {/* 背景图片遮罩 */}
            <div className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-700">
                <Image src="/aboutmebg.png" alt="Identity" fill className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            
            <div className="relative z-10">
              <h3 className="text-red-500 font-bold text-xs uppercase tracking-widest mb-2">My Identity</h3>
              <p className="text-2xl font-bold leading-tight mb-4">
                我是旅行策劃師 & 攝影師 <br />
                <span className="text-white/60">致力於發現未被標記的美好。</span>
              </p>
              <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer text-white">
                    <Instagram size={14} />
                 </div>
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer text-white">
                    <Send size={14} />
                 </div>
              </div>
            </div>
          </div>

          {/* Stats Cards (Compact) */}
          <div className="grid grid-cols-2 gap-3 md:col-span-2">
            {[
              { label: "Cities", val: cityCount, icon: MapPin },
              { label: "Photos", val: photoCount, icon: Camera },
              { label: "Stories", val: postCount, icon: Users },
              { label: "Passion", val: "100%", icon: Heart },
            ].map((s) => (
              <div key={s.label} className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:border-red-500/40 transition-all">
                <s.icon size={14} className="text-red-500 mb-2" />
                <span className="text-3xl font-black tracking-tighter">{s.val}</span>
                <span className="text-[9px] uppercase text-white/40 font-bold tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Value Card 1 (Small) */}
          <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:bg-[#151515] transition-colors">
            <Globe className="text-red-500 mb-4" size={20} />
            <h4 className="font-bold text-sm mb-2 text-white">看見世界</h4>
            <p className="text-xs text-white/40 leading-relaxed">用不同的視角理解城市，每一段路都是新的故事。</p>
          </div>

          {/* Value Card 2 (Small) */}
          <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:bg-[#151515] transition-colors">
            <Compass className="text-red-500 mb-4" size={20} />
            <h4 className="font-bold text-sm mb-2 text-white">好奇心導向</h4>
            <p className="text-xs text-white/40 leading-relaxed">最美的地方往往不在計畫內，而在轉角處。</p>
          </div>

          {/* Value Card 3 (Small) */}
          <div className="bg-[#111] border border-white/5 p-6 rounded-2xl hover:bg-[#151515] transition-colors">
            <Star className="text-red-500 mb-4" size={20} />
            <h4 className="font-bold text-sm mb-2 text-white">品質至上</h4>
            <p className="text-xs text-white/40 leading-relaxed">不追求打卡數量，只在乎快門下的靈魂深度。</p>
          </div>

          {/* Join CTA Card (Action) */}
          <Link href="/contact" className="group bg-red-600 p-6 rounded-2xl flex flex-col justify-between hover:bg-red-500 transition-all">
            <ArrowRight className="self-end group-hover:translate-x-1 transition-transform" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 block mb-1">Collaboration</span>
              <span className="text-lg font-black italic">JOIN THE CLUB</span>
            </div>
          </Link>

        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <section className="px-6 sm:px-12 py-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-black uppercase tracking-tighter">旅人評價</h2>
            <div className="h-px flex-1 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: "Alex", role: "Photographer", text: "他的照片有一種說故事的張力，讓人彷彿置身現場。" },
            { name: "Jessica", role: "Explorer", text: "行程安排非常細膩，去到了很多遊客不知道的私藏景點。" },
            { name: "Ivan", role: "Partner", text: "非常有質感的旅行體驗，是目前我看過最酷的部落格。" },
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                <Quote className="text-red-500/20 mb-3" size={20} />
                <p className="text-white/60 text-sm italic mb-4">"{item.text}"</p>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-500/20" />
                    <div>
                        <p className="text-xs font-bold">{item.name}</p>
                        <p className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">{item.role}</p>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 py-12 border-t border-white/5 text-center">
         <p className="text-[10px] text-white/20 font-medium tracking-[0.5em] uppercase mb-4">Stay Curious • Keep Exploring</p>
         <Link href="/travel" className="inline-flex items-center gap-2 text-xs font-bold border-b border-red-500 pb-1 hover:text-red-500 transition-colors">
            SEE MY JOURNEYS <ArrowRight size={12} />
         </Link>
      </footer>

      <Footer />
    </div>
  );
};

export default AboutPage;