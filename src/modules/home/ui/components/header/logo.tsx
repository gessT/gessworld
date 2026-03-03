import Link from "next/link";
import { Camera } from "lucide-react";

const Logo = () => {
  return (
    <Link href="/" className="flex gap-2 items-center group">
      <div className="bg-red-500 p-1.5 rounded-lg group-hover:bg-red-600 transition-colors">
        <Camera className="w-4 h-4 text-white" />
      </div>
      <span className="font-bold text-lg tracking-tight">Snaptogoclub</span>
    </Link>
  );
};

export default Logo;
