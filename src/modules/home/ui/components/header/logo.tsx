import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/" className="flex gap-2 items-center group">
      <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src="/snapandgo.png"
          alt="Snaptogoclub"
          fill
          className="object-cover"
        />
      </div>
      <span className="font-bold text-lg tracking-tight">Snaptogoclub</span>
    </Link>
  );
};

export default Logo;
