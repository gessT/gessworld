"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, X, Camera } from "lucide-react";
import { useEffect } from "react";

interface MenuItem {
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Travel", href: "/travel" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: Props) {
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden bg-background"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="bg-red-500 p-1.5 rounded-lg">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg">ECarry</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-muted hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile */}
            <div className="px-5 py-6 border-b border-border">
              <div className="flex gap-4 items-center">
                <Avatar className="size-14 border-2 border-red-200">
                  <AvatarImage src="/avatar.jpg" alt="Avatar" />
                  <AvatarFallback className="bg-red-100 text-red-600">EC</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold">ECarry</h1>
                  <p className="text-sm text-muted-foreground">Travel Photographer</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleNavigation(item.href)}
                  className="w-full text-left px-4 py-4 rounded-xl mb-2 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="font-medium">{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                </motion.button>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="px-5 py-6 border-t border-border">
              <button
                onClick={() => handleNavigation("/dashboard")}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
