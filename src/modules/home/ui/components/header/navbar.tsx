import Logo from "./logo";
import Link from "next/link";
import { ThemeSwitch } from "@/components/theme-toggle";

const navItems = [
  { label: "Travel", href: "/travel" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-16 px-4 md:px-8">
      <Logo />
      <div className="hidden lg:flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-sm font-semibold text-foreground/70 hover:text-red-500 transition-colors duration-200 relative group"
          >
            {item.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 rounded-full group-hover:w-full transition-all duration-200" />
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <ThemeSwitch />
      </div>
    </nav>
  );
};

export default Navbar;
