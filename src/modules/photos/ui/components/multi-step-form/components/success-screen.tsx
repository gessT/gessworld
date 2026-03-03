"use client";

import { motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";

interface SuccessScreenProps {
  onReset: () => void;
}

export function SuccessScreen({ onReset }: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="py-12 text-center"
    >
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-600/15 border border-red-500/30 mb-5">
        <Check className="h-8 w-8 text-red-400" strokeWidth={2.5} />
      </div>
      <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
        Photo published
      </h2>
      <p className="text-white/40 text-sm mb-8 max-w-xs mx-auto">
        Your photo has been uploaded and added to your collection.
      </p>
      <button
        onClick={onReset}
        className="flex items-center gap-2 mx-auto border border-white/10 hover:border-white/20 text-white/60 hover:text-white text-sm font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Upload another
      </button>
    </motion.div>
  );
}
