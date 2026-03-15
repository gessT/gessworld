"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { X, Instagram, Mail, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

const menuItems = [
  { label: "探索目的地", subLabel: "DISCOVER", href: "/discover", num: "01" },
  { label: "攝影畫廊", subLabel: "GALLERY", href: "/travel", num: "02" },
  { label: "旅人網誌", subLabel: "JOURNAL", href: "/blog", num: "03" },
  { label: "關於我們", subLabel: "STORY", href: "/about", num: "04" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="fullscreen-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[1001] lg:hidden bg-[#0a0a0a] flex flex-col"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 pt-10 pb-6 flex-shrink-0">
            <span className="text-white/30 text-[10px] tracking-[0.4em] uppercase font-light">
              Snaptogoclub
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Red thin line */}
          <div className="mx-6 h-px bg-red-500/60 flex-shrink-0" />

          {/* Nav items */}
          <nav className="flex-1 flex flex-col justify-center px-6 gap-1">
            {menuItems.map((item, i) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: "easeOut", delay: 0.08 + i * 0.07 }}
                  onClick={() => handleNavigation(item.href)}
                  className="group relative flex items-end gap-4 py-4 text-left border-b border-white/5 active:opacity-60 transition-opacity"
                >
                  {/* Number */}
                  <span className="text-[10px] text-white/20 font-light tracking-widest mb-1 w-5 flex-shrink-0">
                    {item.num}
                  </span>

                  {/* Labels */}
                  <div className="flex-1">
                    <p className="text-[10px] text-white/25 font-light tracking-[0.3em] uppercase mb-1">
                      {item.subLabel}
                    </p>
                    <p className={`text-3xl font-light tracking-tight leading-none transition-colors duration-200 font-[family-name:var(--font-heading)] ${active ? "text-red-400" : "text-white group-hover:text-red-400"
                      }`}>
                      {item.label}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight
                    className={`w-5 h-5 mb-1 flex-shrink-0 transition-all duration-200 ${active
                        ? "text-red-400 opacity-100"
                        : "text-white/20 opacity-0 group-hover:opacity-100 group-hover:text-red-400"
                      }`}
                  />

                  {/* Active dot removed */}
                </motion.button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="px-6 pb-10 flex-shrink-0 space-y-5"
          >
            {/* Social links */}
            <div className="flex items-center gap-6">
              <a
                href="https://www.instagram.com/gess.tue/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/30 hover:text-white text-[10px] tracking-widest uppercase transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                Instagram
              </a>
              <a
                href="https://wa.me/+6593432871" // 格式：國家代碼+號碼，例如 85212345678
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/30 hover:text-white text-[10px] font-light tracking-[0.2em] uppercase transition-all duration-300 group"
              >
                {/* 使用更具對話感的 MessageCircle 圖示 */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 group-hover:scale-110 transition-transform"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.5 8.5 0 0 1 5.4 1.8L22 3l-1.5 5.5Z" />
                </svg>
                WhatsApp
              </a>
            </div>

            <p className="text-white/15 text-[10px] tracking-[0.2em] uppercase">
              © 2026 Snaptogoclub
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

