import { cn } from "@/lib/utils";
import Link from "next/link";
import { MdWhatsapp } from "react-icons/md";
import { PiArrowUpRight, PiInstagramLogo } from "react-icons/pi";
import { WHATSAPP_NUMBER } from "@/constants";

const iconMap = {
  Instagram: <PiInstagramLogo size={14} />,
  "WhatsApp me": <MdWhatsapp size={14} />,
};

interface Props {
  title: keyof typeof iconMap;
  subTitle?: string;
  href?: string;
  className?: string;
  phone?: string; 
}

const ContactCard = ({ title, subTitle, href, className, phone = WHATSAPP_NUMBER }: Props) => {
  const finalHref = title === "WhatsApp me" ? `https://wa.me/${phone}` : href || "#";

  return (
    <Link
      href={finalHref}
      target="_blank"
      className={cn(
        "group relative flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-500",
        "bg-white/[0.03] backdrop-blur-md border border-white/10 hover:border-white/40",
        "active:scale-95", // Mobile-friendly tactile feel
        className
      )}
    >
      {/* Content Section */}
      <div className="flex flex-col items-start transition-all duration-500 group-hover:-translate-y-0.5">
        <span className="text-[7px] leading-none font-bold tracking-[0.3em] text-white/20 uppercase group-hover:text-white/40 transition-colors">
          {subTitle}
        </span>
        <p className="text-[11px] leading-none font-medium tracking-wider mt-1.5 transition-colors">
          {title}
        </p>
      </div>

      {/* ICON STRIP: Vertical Slide Animation */}
      <div className="relative h-[14px] w-[14px] overflow-hidden shrink-0">
        <div className="flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) group-hover:-translate-y-full">
          {/* Layer 1: Brand Icon */}
          <div className="h-[14px] w-[14px] flex items-center justify-center shrink-0 opacity-40 group-hover:opacity-0 transition-opacity duration-300">
            {iconMap[title]}
          </div>
          {/* Layer 2: Action Arrow */}
          <div className="h-[14px] w-[14px] flex items-center justify-center shrink-0">
            <PiArrowUpRight size={14} className="text-current" />
          </div>
        </div>
      </div>
      
      {/* Modern Highlight Glow */}
      <div className="absolute inset-0 rounded-2xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
};

export default ContactCard;