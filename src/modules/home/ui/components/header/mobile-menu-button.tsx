"use client";

import { useState } from "react";
import MobileMenu from "./mobile-menu";
import { Menu, X } from "lucide-react";

const MobileMenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="fixed top-3.5 right-4 z-50 lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:border-red-300 dark:hover:border-red-500/40 transition-colors"
      >
        {isOpen
          ? <X size={17} className="text-zinc-700 dark:text-zinc-200" />
          : <Menu size={17} className="text-zinc-700 dark:text-zinc-200" />}
      </button>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default MobileMenuButton;
