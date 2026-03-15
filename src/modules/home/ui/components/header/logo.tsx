import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-4 group">
      {/* Logo 圖示：加上微光的邊框感 */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-white/40 transition-all duration-500">
        <Image
          src="/snapandgo.png"
          alt="揪 旅 Snaptogoclub"
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      {/* 文字區域：垂直排列 */}
      <div className="flex flex-col justify-center border-l border-white/10 pl-4 py-0.5 group-hover:border-white/30 transition-colors">
        <div className="flex items-baseline gap-2">
          {/* 主標題：極細體、寬字距 */}
          <span className="font-light text-xl md:text-2xl tracking-[0.3em] text-white/90 group-hover:text-white transition-all duration-300">
            揪 旅 啦
          </span>
          {/* 品牌英文名：極小、極淡 */}
          <span className="hidden md:block font-extralight text-[9px] tracking-[0.2em] text-white/20 uppercase">
            Snaptogoclub
          </span>
        </div>

        {/* 副標題：設計靈魂所在 */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-extralight tracking-[0.15em] text-white/40 group-hover:text-white/60 transition-colors duration-500">
            揪取故事，由旅行框景
          </span>
          <span className="hidden sm:inline w-4 h-[1px] bg-red-500/40" />
          <span className="hidden sm:inline text-[8px] font-thin tracking-[0.2em] text-white/20 uppercase italic">
            Brewing Stories
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
