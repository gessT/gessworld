import { cn } from "@/lib/utils";
import Link from "next/link";
import { MdEmail } from "react-icons/md";
import {
  PiArrowUpRight,
  PiInstagramLogo,
  PiGithubLogo,
  PiXLogo,
} from "react-icons/pi";
import { SiXiaohongshu } from "react-icons/si";

// icon map
const iconMap = {
  Instagram: <PiInstagramLogo size={18} />,
  GitHub: <PiGithubLogo size={18} />,
  X: <PiXLogo size={18} />,
  Xiaohongshu: <SiXiaohongshu size={18} />,
  "Contact me": <MdEmail size={18} />,
};

interface Props {
  title: keyof typeof iconMap;
  href?: string;
  className?: string;
}

const ContactCard = ({ title, href, className }: Props) => {
  return (
    <Link
      href={href || " "}
      target="_blank"
      className={cn(
        "w-full h-full p-4 lg:p-5 bg-card border border-border hover:border-red-200 dark:hover:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-xl flex justify-between items-center cursor-pointer group transition-all duration-200 shadow-sm",
        className
      )}
    >
      <p className="text-sm font-medium">{title}</p>

      <div className="relative inline-block overflow-hidden size-[18px]">
        <div className="relative inline-block group h-full w-full">
          <span className="block transform transition-transform duration-200 ease-in-out group-hover:-translate-y-full">
            {iconMap[title]}
          </span>
          <span className="absolute inset-0 transform translate-y-full transition-transform duration-200 ease-in-out group-hover:translate-y-0 text-red-500">
            <PiArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ContactCard;
