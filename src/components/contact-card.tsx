import { cn } from "@/lib/utils";
import Link from "next/link";
import { MdWhatsapp } from "react-icons/md";
import { PiArrowUpRight, PiInstagramLogo } from "react-icons/pi";

const iconMap = {
  Instagram: <PiInstagramLogo size={18} />,
  "WhatsApp me": <MdWhatsapp size={18} />,
};

interface Props {
  title: keyof typeof iconMap;
  href?: string;
  className?: string;
  phone?: string; // 新增電話參數
}

const ContactCard = ({ title, href, className, phone = "85212345678" }: Props) => {
  // 自動判斷連結：若是 WhatsApp 則生成專屬連結
  const finalHref = title === "WhatsApp me" 
    ? `https://wa.me/${phone}` 
    : href || "#";

  const isWhatsApp = title === "WhatsApp me";

  return (
    <Link
      href={finalHref}
      target="_blank"
      className={cn(
        "w-full h-full p-4 lg:p-5 rounded-full flex justify-between items-center cursor-pointer group transition-all duration-500",
        // 預設樣式：極簡深色背景
        "bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10",
        // WhatsApp 專屬強烈風格（若有傳入 className 則會覆蓋）
        isWhatsApp && "bg-red-600 border-red-500 hover:bg-red-500 hover:border-red-400 text-white shadow-lg shadow-red-600/20",
        className
      )}
    >
      {/* 文字：改為細體與寬字距 */}
      <p className="text-sm font-light tracking-[0.15em] uppercase transition-all duration-300 group-hover:translate-x-1">
        {title}
      </p>

      <div className="relative inline-block overflow-hidden size-[18px]">
        <div className="relative inline-block group h-full w-full">
          {/* 原始 Icon */}
          <span className="block transform transition-transform duration-300 ease-in-out group-hover:-translate-y-full">
            {iconMap[title]}
          </span>
          {/* Hover 切換後的箭頭 */}
          <span className={cn(
            "absolute inset-0 transform translate-y-full transition-transform duration-300 ease-in-out group-hover:translate-y-0",
            isWhatsApp ? "text-white" : "text-white" // 全部改為純白 Hover
          )}>
            <PiArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ContactCard;