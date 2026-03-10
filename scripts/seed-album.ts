import "dotenv/config";
import { db } from "@/db";
import { photos, citySets } from "@/db/schema";
import { sql } from "drizzle-orm";
// ─────────────────────────────────────────────────────────────────────────────
// 1.  ALBUM CONFIG (Updated for Sawara)
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// 1. 相簿配置 (繁體中文版)
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// 1. 相簿配置 (佐原小江戶)
// ─────────────────────────────────────────────────────────────────────────────
const ALBUM = {
  country: "日本",
  countryCode: "JP",
  region: "千葉縣",
  city: "佐原",
  description: "探索佐原小野川運河沿岸，沉浸於「小江戶」的懷舊氛圍中。",
  cover_photo_id: null, // 插入數據後請更新為 POST1-1 的實例 ID
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. 照片數據庫 (對應圖片中的 POST1-1 至 POST1-12)
// ─────────────────────────────────────────────────────────────────────────────
const DUMMY_PHOTOS = [
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-1.jpg",
    title: "小野川垂柳初探",
    description: "沿著歷史悠久的運河河岸，垂柳倒映在平靜的水面上。",
    visibility: "public" as const,
    isFavorite: true,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "LGF5]+Yk^6#M@-5c,1J5@[or[Q6.",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T10:00:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-2.jpg",
    title: "老街木造建築",
    description: "傳統二層木造 merchant house，展现典型的「藏造」建築風格。",
    visibility: "public" as const,
    isFavorite: false,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T10:15:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-3.jpg",
    title: "運河街景透視",
    description: "從小野川河畔遠望，江戶時代風格的建築群沿河展開。",
    visibility: "public" as const,
    isFavorite: false,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "LBF~Ht00IUt7?bNGRjWB00%Mt7WB",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T10:30:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-4.jpg",
    title: "漫步水鄉",
    description: "旅人穿行於古樸的石板路上，感受午後安靜的佐原日常。",
    visibility: "public" as const,
    isFavorite: false,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "LGF5]+Yk^6#M@-5c,1J5@[or[Q6.",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T10:45:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-5.jpg",
    title: "「全正堂」前的人影",
    description: "駐足於帶有大型書法字樣的白色壁面前，對比鮮明的視覺感受。",
    visibility: "public" as const,
    isFavorite: false,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T11:00:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-6.jpg",
    title: "橋頭與垂柳",
    description: "从小野川橋樑處俯瞰，綠意盎然的柳樹遮蓋了半個河道。",
    visibility: "public" as const,
    isFavorite: false,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "LBF~Ht00IUt7?bNGRjWB00%Mt7WB",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T11:15:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-7.jpg",
    title: "佐原町並觀",
    description: "傳統商鋪整齊排列，這裡是日本重要傳統建築物群保護區。",
    visibility: "public" as const,
    isFavorite: false,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "LGF5]+Yk^6#M@-5c,1J5@[or[Q6.",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T11:30:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-8.jpg",
    title: "伊能忠敬舊宅門前",
    description: "在著名的測繪家舊居藍色暖簾前留影，古蹟的厚重感躍然紙上。",
    visibility: "public" as const,
    isFavorite: true,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T11:45:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-9.jpg",
    title: "陽光下的河畔人家",
    description: "午後強烈的陽光照射在傳統民居的灰瓦白牆上。",
    visibility: "public" as const,
    isFavorite: false,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "LBF~Ht00IUt7?bNGRjWB00%Mt7WB",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T12:00:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-10.jpg",
    title: "深色木質外牆",
    description: "佐原獨特的黑色木牆結構，與藍天形成鮮明對比。",
    visibility: "public" as const,
    isFavorite: false,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "LGF5]+Yk^6#M@-5c,1J5@[or[Q6.",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T12:15:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-11.jpg",
    title: "運河沿線景觀",
    description: "小野川旁豎立著祭典旗幟，展現水鄉特有的民俗氣息。",
    visibility: "public" as const,
    isFavorite: false,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T12:30:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-12.jpg",
    title: "黃昏的小野川",
    description: "夕陽餘暉灑在運河上，為「小江戶」的一天畫上句號。",
    visibility: "public" as const,
    isFavorite: true,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "LBF~Ht00IUt7?bNGRjWB00%Mt7WB",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "千葉縣香取市佐原",
    make: "SONY",
    model: "A6700",
    lensModel: "Sigma 18-50mm F2.8",
    dateTimeOriginal: new Date("2026-03-10T12:45:00"),
  }
];
// ─────────────────────────────────────────────────────────────────────────────
// 3.  SEED LOGIC  (no edits needed below this line)
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🌱  Seeding album "${ALBUM.city}, ${ALBUM.country}" with ${DUMMY_PHOTOS.length} photos…\n`);

  const insertedPhotos: { id: string; title: string }[] = [];

  for (const photo of DUMMY_PHOTOS) {
    const [row] = await db.insert(photos).values(photo).returning();
    insertedPhotos.push({ id: row.id, title: row.title });
    console.log(`  ✅  Photo inserted: "${row.title}" (${row.id})`);
  }

  // The first inserted photo becomes the album cover
  const coverPhotoId = insertedPhotos[0].id;
  const cityName = ALBUM.countryCode === "JP" || ALBUM.countryCode === "TW" ? ALBUM.region : ALBUM.city;

  await db
    .insert(citySets)
    .values({
      country: ALBUM.country,
      countryCode: ALBUM.countryCode,
      city: cityName,
      description: ALBUM.description,
      coverPhotoId,
      photoCount: insertedPhotos.length,
    })
    .onConflictDoUpdate({
      target: [citySets.country, citySets.city],
      set: {
        photoCount: sql`${citySets.photoCount} + ${insertedPhotos.length}`,
        coverPhotoId: sql`COALESCE(${citySets.coverPhotoId}, ${coverPhotoId})`,
        updatedAt: new Date(),
      },
    });

  console.log(`\n  🗂️  Album upserted: "${cityName}, ${ALBUM.country}" — cover: ${coverPhotoId}`);
  console.log("\n✨  Done.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
