import Link from "next/link";
import { Mail, MapPin, Phone, Instagram, ArrowRight, Camera, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="w-full">
      {/* Newsletter CTA */}
      <div className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-3 text-white">
              <h3 className="text-2xl md:text-3xl font-bold">Join the Journey</h3>
              <p className="text-white/80 text-base">Get travel stories and photography tips in your inbox.</p>
            </div>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl focus:bg-white/30"
              />
              <Button className="bg-white text-red-600 hover:bg-white/90 rounded-xl px-6 font-semibold shadow-lg">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="space-y-4 lg:col-span-1">
              <div className="flex items-center gap-2">
                <div className="bg-red-500 p-1.5 rounded-lg">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Snaptogoclub</h2>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
              A Social Travel Photography Community
              We travel together. We create together.
              </p>
              <div className="flex gap-3 pt-2">
                <a href="https://www.instagram.com/gess.tue/" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-red-500 p-2.5 rounded-xl transition-all duration-200">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="mailto:tueguosheng@gmail.com" className="bg-gray-800 hover:bg-red-500 p-2.5 rounded-xl transition-all duration-200">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Explore */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Explore</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Home</Link></li>
                <li><Link href="/travel" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Destinations</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Blog</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-red-400 text-sm transition-colors">About</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/dashboard" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Dashboard</Link></li>
                <li><Link href="/discover" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Discover</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Gallery</a></li>
                <li><a href="#" className="text-gray-300 hover:text-red-400 text-sm transition-colors">Collections</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-gray-300 text-sm">
                  <Mail className="w-4 h-4 text-red-400" />
                  <span>tueguosheng@gmail.com</span>
                </li>
                <li className="flex items-center gap-2.5 text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>Global Traveler</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                © 2026 Snaptogoclub. All rights reserved.
              </p>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by Snaptogoclub
              </div>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-500 hover:text-red-400 transition-colors">Privacy</a>
                <a href="#" className="text-gray-500 hover:text-red-400 transition-colors">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
