import Image from "next/image";
import Link from "next/link";
import { Camera, Users, MapPin, Calendar, ArrowRight, Star } from "lucide-react";
const PRODUCTS = [
  {
    id: "iceland-001",
    title: "冰島：極光與孤島靈魂",
    subtitle: "專業旅拍深度 10 日遊",
    // 关键词: iceland, aurora, lighthouse
    image: "https://images.unsplash.com/photo-1538332576228-eb5b4c4de6f5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    location: "冰島, 雷克雅未克",
    duration: "10 Days",
    price: "8,800",
    tags: ["攝影導向", "極光獵人", "奢華露營"],
    features: { photography: true, social: true, adventure: true }
  },
  {
    id: "japan-002",
    title: "京都：櫻花祭暗光美學",
    subtitle: "深夜食堂與人文街道攝影",
    // 关键词: kyoto, japan, night
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200",
    location: "日本, 京都",
    duration: "6 Days",
    price: "3,200",
    tags: ["掃街攝影", "地道美食", "小眾古寺"],
    features: { photography: true, social: true, adventure: false }
  },
  {
    id: "morocco-003",
    title: "摩洛哥：撒哈拉色彩實驗室",
    subtitle: "三毛筆下的異域風情 8 日",
    // 关键词: morocco, desert, sahara
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200",
    location: "摩洛哥, 舍夫沙萬",
    duration: "8 Days",
    price: "5,500",
    tags: ["人像大片", "沙漠探險", "異域建築"],
    features: { photography: true, social: true, adventure: true }
  }
];
export const page = () => {
  return (
    <section className="px-4 md:px-10 py-10 bg-[#080808]">
      {/* 头部文案 */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div className="max-w-xl">
          <span className="text-red-500 text-[10px] font-black tracking-[0.3em] uppercase">Upcoming Trips</span>
          <h2 className="text-4xl font-black tracking-tighter mt-2">加入我們的 <span className="text-white/40">旅拍團</span></h2>
        </div>
        <Link href="/tours" className="text-xs font-bold border-b border-white/20 pb-1 hover:border-red-500 transition-colors">
          查看所有行程
        </Link>
      </div>

      {/* 产品 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {PRODUCTS.map((tour) => (
          <div key={tour.id} className="group relative bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-500">
            
            {/* 图片区域 */}
            <div className="relative h-64 w-full overflow-hidden">
              <Image 
                src={tour.image} 
                alt={tour.title} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
              
              {/* 顶部标签 */}
              <div className="absolute top-4 left-4 flex gap-2">
                {tour.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-black/60 backdrop-blur-md text-[9px] font-bold rounded uppercase border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>

              {/* 价格 */}
              <div className="absolute bottom-4 left-4">
                <span className="text-xs text-white/60">From</span>
                <p className="text-xl font-black text-white">${tour.price}</p>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-white/40 text-[10px] font-bold uppercase">
                  <MapPin size={10} className="text-red-500" />
                  {tour.location}
                </div>
                <div className="flex items-center gap-1 text-white/40 text-[10px] font-bold uppercase">
                  <Calendar size={10} className="text-red-500" />
                  {tour.duration}
                </div>
              </div>

              <h3 className="text-lg font-bold mb-1 group-hover:text-red-500 transition-colors">{tour.title}</h3>
              <p className="text-xs text-white/40 mb-6 line-clamp-1">{tour.subtitle}</p>

              {/* 亮点图标区 */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex gap-4">
                  {tour.features.photography && <Camera size={16} className="text-white/20 hover:text-red-500 cursor-help" title="攝影指導" />}
                  {tour.features.social && <Users size={16} className="text-white/20 hover:text-red-500 cursor-help" title="社交聚會" />}
                  {tour.features.adventure && <Star size={16} className="text-white/20 hover:text-red-500 cursor-help" title="冒險體驗" />}
                </div>
                
                <Link href={`/tours/${tour.id}`} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white group-hover:text-red-500 transition-colors">
                  Details <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default page;