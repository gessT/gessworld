"use client"; // Required to use usePathname

import { usePathname } from "next/navigation";
import Logo from "./logo";
import { ThemeSwitch } from "@/components/theme-toggle";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Standard Tailwind utility for merging classes

const navItems = [
  { label: "探索目的地", subLabel: "EXPLORE", href: "/explore" },

  { label: "攝影畫廊", subLabel: "GALLERY", href: "/travel" },

  { label: "旅人網誌", subLabel: "JOURNAL", href: "/blog" },
  { label: "關於我們", subLabel: "STORY", href: "/about" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between h-16 px-4 md:px-8">
      <Logo />

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-12">
        {navItems.map((item) => {
          // Check if the current link is active
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="group relative py-2 flex flex-col items-center md:items-start"
            >
              {/* Sub Label */}
              <span className={cn(
                "text-[9px] font-extralight tracking-[0.3em] transition-colors duration-300 uppercase",
                isActive ? "text-white/60" : "text-white/30 group-hover:text-white/50"
              )}>
                {item.subLabel}
              </span>

              {/* Main Label */}
              <span className={cn(
                "text-sm font-light tracking-[0.15em] transition-all duration-300",
                isActive ? "text-white" : "text-white/60 group-hover:text-white"
              )}>
                {item.label}
              </span>

              {/* Underline */}
              <span className={cn(
                "absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1px] bg-white transition-all duration-500 ease-out",
                isActive ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitch />
      </div>
    </nav>
  );
};

export default Navbar;