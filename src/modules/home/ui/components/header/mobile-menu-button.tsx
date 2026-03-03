"use client";

import React from "react";
import { useState } from "react";
import MobileMenu from "./mobile-menu";
import { Menu } from "lucide-react";

const MobileMenuButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-3 right-4 z-40 lg:hidden p-2.5 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default MobileMenuButton;
