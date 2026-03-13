import Logo from "./logo";
import { ThemeSwitch } from "@/components/theme-toggle";
import Link from "next/link";

const navItems = [
  { label: "探索目的地", subLabel: "EXPLORE", href: "/travel" },
  { label: "旅人網誌", subLabel: "JOURNAL", href: "/blog" },
  { label: "關於我們", subLabel: "STORY", href: "/about" },
];

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-16 px-4 md:px-8">   <Logo />

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-12">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group relative py-2 flex flex-col items-center md:items-start"
          >
            {/* 副標題：放在主標題上方，極細且淡 */}
            <span className="text-[9px] font-extralight tracking-[0.3em] text-white/30 group-hover:text-white/50 transition-colors duration-300 uppercase">
              {item.subLabel}
            </span>
            
            {/* 主標題：純白 Hover 效果 */}
            <span className="text-sm font-light tracking-[0.15em] text-white/60 group-hover:text-white transition-all duration-300">
              {item.label}
            </span>
            
            {/* 底線：純白細線，從中間展開 */}
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-500 ease-out" />
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitch />
      </div>
    </nav>
  );
};

export default Navbar;
