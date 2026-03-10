/**
 * seed-album.ts
 * ─────────────
 * Inserts a dummy album (city set) + a few photos into the database.
 *
 * Usage:
 *   bun run seed:album
 *
 * Notes:
 *   • url fields use the S3 key format: photos/{city-slug}/{filename}
 *   • blurData is a Blurhash string — replace with real ones from https://blurha.sh
 *   • The album row is created automatically from the first photo's city/country.
 *   • Safe to run multiple times — uses onConflictDoUpdate for the city set.
 */

import "dotenv/config";
import { db } from "@/db";
import { photos, citySets } from "@/db/schema";
import { sql } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// 1.  ALBUM CONFIG  (edit these to match your real album)
// ─────────────────────────────────────────────────────────────────────────────
const ALBUM = {
  country: "Japan",
  countryCode: "JP",
  region: "Tokyo",   // used as city name for JP / TW
  city: "Tokyo",     // must match photos below
  description: "Cherry-blossom season in the streets of Tokyo.",
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.  PHOTOS  (add / duplicate entries as needed)
//     • url        → S3 key, e.g.  photos/tokyo/filename.jpg
//     • blurData   → Blurhash (placeholder used below — swap with real ones)
//     • aspectRatio = width / height
// ─────────────────────────────────────────────────────────────────────────────
const DUMMY_PHOTOS = [
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/tokyo/6313ce3c-ee11-4f25-a533-92e079446a71-POST1-23-1773105570503.jpg",
    title: "Shinjuku at Dusk",
    description: "Golden hour light spilling through the skyscrapers of Shinjuku.",
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
    fullAddress: "Shinjuku, Tokyo, Japan",
    make: "SONY",
    model: "A7 IV",
    lensModel: "FE 24-70mm F2.8 GM",
    dateTimeOriginal: new Date("2025-04-03T18:30:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/tokyo/6313ce3c-ee11-4f25-a533-92e079446a71-POST1-23-1773105570503.jpg",
    title: "Senso-ji Morning Light",
    description: "Incense smoke drifting past the lanterns of Senso-ji Temple before the crowds arrive.",
    visibility: "public" as const,
    isFavorite: false,
    aspectRatio: 0.667,    // portrait
    width: 2667,
    height: 4000,
    blurData: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "Asakusa, Tokyo, Japan",
    make: "SONY",
    model: "A7 IV",
    lensModel: "FE 24-70mm F2.8 GM",
    dateTimeOriginal: new Date("2025-04-04T06:15:00"),
  },
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/tokyo/post1-1.jpg",
    title: "Shibuya Crossing Rush",
    description: "The organised chaos of Shibuya Crossing captured at peak hour.",
    visibility: "public" as const,
    isFavorite: false,
    aspectRatio: 1.778,    // 16:9
    width: 4800,
    height: 2700,
    blurData: "LBF~Ht00IUt7?bNGRjWB00%Mt7WB",
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "Shibuya, Tokyo, Japan",
    make: "SONY",
    model: "A7 IV",
    lensModel: "FE 16-50mm F2.8 GM",
    dateTimeOriginal: new Date("2025-04-04T20:00:00"),
  },
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
