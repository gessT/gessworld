"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { X, Home, Compass, BookOpen, User, LayoutDashboard, Globe, ChevronRight } from "lucide-react";
import { useEffect } from "react";

const menuItems = [
  { label: "Home", href: "/", icon: Home, desc: "Start here" },
  { label: "Travel", href: "/travel", icon: Compass, desc: "Explore destinations" },
  { label: "Blog", href: "/blog", icon: BookOpen, desc: "Stories & journal" },
  { label: "About", href: "/about", icon: User, desc: "About me" },
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
        <>
          {/* Dark backdrop — tap to close */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          />

          {/* Slide-in drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
            className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col lg:hidden bg-white dark:bg-zinc-900 overflow-hidden"
          >
            {/* ── Red header bar ── */}
            <div className="relative bg-red-500 px-5 pt-12 pb-7 flex-shrink-0">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Brand */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src="/snapandgo.png"
                    alt="Snaptogoclub"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">Snaptogoclub</span>
              </div>

              {/* Tagline */}
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-red-200" />
                <p className="text-red-100 text-xs font-medium">Travel · Photography · Stories</p>
              </div>
            </div>

            {/* ── Navigation links ── */}
            <nav className="flex-1 py-3 overflow-hidden">
              <p className="px-5 pt-2 pb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Menu
              </p>

              {menuItems.map((item, i) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <motion.button
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.06 }}
                    onClick={() => handleNavigation(item.href)}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative w-full flex items-center gap-3.5 px-5 py-3.5 transition-all
                      ${
                        active
                          ? "bg-red-50 dark:bg-red-500/10"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }
                    `}
                  >
                    {/* Active indicator */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-red-500 rounded-r-full" />
                    )}

                    {/* Icon box */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        active
                          ? "bg-red-500 shadow-md shadow-red-200 dark:shadow-red-900"
                          : "bg-zinc-100 dark:bg-zinc-800"
                      }`}
                    >
                      <Icon
                        size={17}
                        className={active ? "text-white" : "text-zinc-500 dark:text-zinc-400"}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 text-left">
                      <p
                        className={`text-sm font-semibold leading-none mb-0.5 ${
                          active ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{item.desc}</p>
                    </div>

                    <ChevronRight
                      size={14}
                      className={active ? "text-red-400" : "text-zinc-300 dark:text-zinc-600"}
                    />
                  </motion.button>
                );
              })}
            </nav>

            {/* ── Divider ── */}
            <div className="mx-5 h-px bg-zinc-100 dark:bg-zinc-800 flex-shrink-0" />

            {/* ── Bottom actions ── */}
            <div className="px-5 py-5 flex-shrink-0 space-y-2.5">
              <button
                onClick={() => handleNavigation("/dashboard")}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-md shadow-red-200 dark:shadow-red-900/40"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </button>
              <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600">
                © 2026 Snaptogoclub
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
