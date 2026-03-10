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
// 1.  ALBUM CONFIG (Updated for Sawara)
// ─────────────────────────────────────────────────────────────────────────────
const ALBUM = {
  country: "Japan",
  countryCode: "JP",
  region: "Chiba",   
  city: "Sawara",    
  description: "Exploring the 'Little Edo' atmosphere along the Ono River canals in Sawara.",
};

// ─────────────────────────────────────────────────────────────────────────────
// 2.  PHOTOS (Generated from Sawara image sequence)
// ─────────────────────────────────────────────────────────────────────────────
const DUMMY_PHOTOS = [
  {
    url: "https://snaptogoclub.s3.ap-southeast-1.amazonaws.com/photos/sawara/POST1-1.jpg",
    title: "Ono River Willow Trees",
    description: "The iconic weeping willows lining the historic canal banks.",
    visibility: "public" as const,
    isFavorite: true,
    aspectRatio: 1.5,
    width: 4000,
    height: 2667,
    blurData: "LGF5]+Yk^6#M@-5c,1J5@[or[Q6.", // Placeholder
    country: ALBUM.country,
    countryCode: ALBUM.countryCode,
    region: ALBUM.region,
    city: ALBUM.city,
    fullAddress: "Sawara, Katori, Chiba, Japan",
    make: "SONY",
    model: "A7 IV",
    lensModel: "FE 24-70mm F2.8 GM",
    dateTimeOriginal: new Date("2026-03-10T10:00:00"),
  }
]
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
