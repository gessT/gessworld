import Link from "next/link";
import { Mail, MapPin, Instagram, Camera, Globe, Compass, Plane, ArrowUpRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#050505] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">

          {/* Section 1: Brand Identity (占 5 欄) */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/5 p-2 rounded-full border border-white/10">
                <Camera className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-light tracking-[0.25em] uppercase">
                Snaptogoclub
              </h2>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-light tracking-[0.2em] text-white/80 uppercase">
                旅行 <span className="text-white/20 mx-1">|</span> 攝影 <span className="text-white/20 mx-1">|</span> 社交
              </p>
              <p className="text-xs md:text-sm text-white/40 font-extralight tracking-[0.1em] leading-relaxed max-w-[320px]">
                我們一起旅行，一起創作，一起用鏡頭捕捉世界的細微末節。
              </p>
            </div>

            <div className="flex gap-6 pt-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/gess.tue/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-white/40 hover:text-white transition-all duration-500"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
                <span className="text-[10px] tracking-[0.2em] uppercase hidden md:block font-light">
                  Instagram
                </span>
              </a>

              {/* WhatsApp - 這裡替換了 Email */}
              <a
                href="https://wa.me/+6593432871" // 格式範例：https://wa.me/85212345678
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-white/40 hover:text-white transition-all duration-500"
              >
                {/* 使用 MessageCircle 或直接用 Lucide 的 Phone/Message 圖示，這裡推薦 MessageCircle 更有社群感 */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.5 8.5 0 0 1 5.4 1.8L22 3l-1.5 5.5Z" />
                </svg>
                <span className="text-[10px] tracking-[0.2em] uppercase hidden md:block font-light">
                  WhatsApp
                </span>
              </a>
            </div>
          </div>

          {/* Section 2 & 3: Links (手機版並排，電腦版各占 2-3 欄) */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">

            {/* 探索導覽 */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">探索 / Explore</h4>
              <ul className="space-y-4">
                {[
                  { label: '首頁', href: '/' },
                  { label: '目的地', href: '/travel' },
                  { label: '旅行網誌', href: '/blog' },
                  { label: '關於我們', href: '/about' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="group flex items-center gap-1 text-white/60 hover:text-white text-xs md:text-sm font-light tracking-widest transition-all">
                      {item.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 資源中心 */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">資源 / Resources</h4>
              <ul className="space-y-4">
                {[
                  { label: '控制台', href: '/dashboard' },
                  { label: '發現靈感', href: '/discover' },
                  { label: '攝影畫廊', href: '/discover' },
                  { label: '精選合集', href: '/discover' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="group flex items-center gap-1 text-white/60 hover:text-white text-xs md:text-sm font-light tracking-widest transition-all">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 聯絡資訊 (僅電腦版顯示為獨立欄位) */}
            <div className="hidden md:block space-y-6">
              <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">聯絡 / Contact</h4>
              <div className="space-y-4 text-white/50 text-xs font-light tracking-widest">
                <a href="mailto:tueguosheng@gmail.com" className="hover:text-white transition-colors">tueguosheng@gmail.com</a>
                <p>全球旅人 / Global Traveler</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: 版權資訊 */}
        <div className="border-t border-white/5 pt-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <p className="text-white/20 text-[10px] font-extralight tracking-[0.2em] uppercase">
                © 2026 SNAPTOGOCLUB. ALL RIGHTS RESERVED.
              </p>
            </div>

            <div className="flex gap-8">
              <a href="#" className="text-white/20 hover:text-white/50 text-[10px] font-extralight tracking-[0.2em] uppercase transition-colors">Privacy</a>
              <a href="#" className="text-white/20 hover:text-white/50 text-[10px] font-extralight tracking-[0.2em] uppercase transition-colors">Terms</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;