"use client";

import { motion } from "framer-motion";

export default function HeroScroll() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-1">
      <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Scroll</p>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
      >
        <div className="w-1 h-1.5 bg-white/60 rounded-full" />
      </motion.div>
    </div>
  );
}
