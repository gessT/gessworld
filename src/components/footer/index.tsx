import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 text-white">
      {/* Top CTA Section */}
      <div className="border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Newsletter Text */}
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold">Stay Updated</h3>
              <p className="text-slate-300 text-lg">Get the latest travel stories and photography tips delivered to your inbox.</p>
            </div>

            {/* Newsletter Form */}
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-lg"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-1">
            <div>
              <h2 className="text-2xl font-bold">ECarry</h2>
              <p className="text-slate-400 text-sm mt-1">Travel & Photography</p>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Capturing the world's most beautiful moments through the lens of exploration and adventure.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-4">
              <a href="#" className="bg-slate-800 hover:bg-blue-600 p-2 rounded-lg transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-800 hover:bg-blue-600 p-2 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-800 hover:bg-blue-600 p-2 rounded-lg transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="bg-slate-800 hover:bg-blue-600 p-2 rounded-lg transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explore Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Explore</h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-slate-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/travel" className="text-slate-300 hover:text-white transition-colors">Destinations</a></li>
              <li><a href="/blog" className="text-slate-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/about" className="text-slate-300 hover:text-white transition-colors">About</a></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            <ul className="space-y-3">
              <li><a href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Gallery</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Collections</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Map</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4" />
                <span>hello@ecarry.com</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4" />
                <span>Global</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 000-0000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8">
          {/* Bottom Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Left - Copyright */}
            <div className="text-slate-400 text-sm">
              <p>© 2026 ECarry. All rights reserved.</p>
            </div>

            {/* Center - Links */}
            <div className="flex flex-wrap gap-6 justify-center text-sm">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Cookies</a>
            </div>

            {/* Right - Payment Methods */}
            <div className="text-slate-400 text-sm text-right">
              <p>Secured by industry-leading security</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
