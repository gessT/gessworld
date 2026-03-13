import "dotenv/config";
import { db } from "@/db";
import { photos, citySets } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { readdirSync, readFileSync } from "fs";
import { join, resolve } from "path";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface AlbumPhoto {
  url: string;
  title: string;
  description: string;
  visibility: "public" | "private";
  isFavorite: boolean;
  aspectRatio: number;
  width: number;
  height: number;
  blurData?: string;
  fullAddress?: string;
  make?: string;
  model?: string;
  lensModel?: string;
  dateTimeOriginal?: string;
}

interface AlbumData {
  album: {
    country: string;
    countryCode: string;
    city?: string;
    region?: string;
    description?: string;
  };
  photos: AlbumPhoto[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Load all album JSON files from scripts/albums/
// ─────────────────────────────────────────────────────────────────────────────
// Use process.cwd() for reliable path resolution across bun/tsx/node
const ALBUMS_DIR = resolve(process.cwd(), "scripts", "albums");
const albumFiles = readdirSync(ALBUMS_DIR).filter((f) => f.endsWith(".json"));
const ALL_ALBUMS: AlbumData[] = albumFiles.map((file) => {
  const content = readFileSync(join(ALBUMS_DIR, file), "utf-8");
  const raw = JSON.parse(content) as Record<string, unknown>;

  // Support both lowercase keys ("album"/"photos") and uppercase ("ALBUM"/"DUMMY_PHOTOS")
  const album = (raw.album ?? raw.ALBUM) as (AlbumData["album"] & { DUMMY_PHOTOS?: AlbumData["photos"]; photos?: AlbumData["photos"] }) | undefined;
  // Photos can be at root level OR nested inside the album object
  const photos = (raw.photos ?? raw.DUMMY_PHOTOS ?? album?.photos ?? album?.DUMMY_PHOTOS) as AlbumData["photos"] | undefined;

  if (!album || !photos) {
    throw new Error(`Invalid album JSON in ${file}: missing "album"/"ALBUM" or "photos"/"DUMMY_PHOTOS" key`);
  }
  return { album, photos };
});

// ─────────────────────────────────────────────────────────────────────────────
// Seed logic
// ─────────────────────────────────────────────────────────────────────────────
async function seedAlbum(data: AlbumData) {
  const { album, photos: albumPhotos } = data;
  const label = album.city ?? album.region ?? "Unknown";

  console.log(`\n🌱  Seeding album "${label}, ${album.country}" with ${albumPhotos.length} photos…\n`);

  const insertedPhotos: { id: string; title: string }[] = [];

  for (const photo of albumPhotos) {
    // Skip if a photo with this URL already exists
    const [existing] = await db
      .select({ id: photos.id, title: photos.title })
      .from(photos)
      .where(eq(photos.url, photo.url))
      .limit(1);

    if (existing) {
      console.log(`  ⏭️  Skipped (already exists): "${photo.title}"`);
      insertedPhotos.push({ id: existing.id, title: existing.title });
      continue;
    }

    try {
      const [row] = await db
        .insert(photos)
        .values({
          url: photo.url,
          title: photo.title,
          description: photo.description,
          visibility: photo.visibility,
          isFavorite: photo.isFavorite,
          aspectRatio: photo.aspectRatio,
          width: photo.width,
          height: photo.height,
          blurData: photo.blurData ?? "",
          country: album.country,
          countryCode: album.countryCode,
          city: album.city ?? album.region ?? null,
          region: album.region ?? null,
          fullAddress: photo.fullAddress,
          make: photo.make,
          model: photo.model,
          lensModel: photo.lensModel,
          dateTimeOriginal: photo.dateTimeOriginal
            ? new Date(photo.dateTimeOriginal)
            : undefined,
        })
        .returning();
      if (row) {
        insertedPhotos.push({ id: row.id, title: row.title });
        console.log(`  ✅  Photo inserted: "${row.title}" (${row.id})`);
      }
    } catch (err) {
      console.warn(`  ⚠️  Error inserting "${photo.title}": ${err instanceof Error ? err.message : err}`);
    }
  }

  // If no photos inserted, create a placeholder cover photo so the citySet can have a valid FK
  let coverPhotoId: string;
  if (insertedPhotos.length > 0) {
    coverPhotoId = insertedPhotos[0].id;
  } else {
    console.log(`  ⚠️  No photos inserted — creating placeholder cover photo for "${label}"`);
    const firstPhoto = albumPhotos[0];
    const [placeholder] = await db
      .insert(photos)
      .values({
        url: firstPhoto?.url ?? `placeholder/${label}`,
        title: firstPhoto?.title ?? label,
        description: firstPhoto?.description ?? "",
        visibility: "public",
        isFavorite: false,
        aspectRatio: firstPhoto?.aspectRatio ?? 1.5,
        width: firstPhoto?.width ?? 1200,
        height: firstPhoto?.height ?? 800,
        blurData: firstPhoto?.blurData ?? "",
        country: album.country,
        countryCode: album.countryCode,
        city: album.city ?? album.region ?? null,
        region: album.region ?? null,
      })
      .returning();
    coverPhotoId = placeholder.id;
    insertedPhotos.push({ id: placeholder.id, title: placeholder.title });
    console.log(`  ✅  Placeholder photo created: (${placeholder.id})`);
  }

  await db
    .insert(citySets)
    .values({
      country: album.country,
      countryCode: album.countryCode,
      city: album.city ?? album.region ?? null,
      region: album.region ?? null,
      description: album.description ?? null,
      coverPhotoId,
      photoCount: insertedPhotos.length,
    })
    .onConflictDoNothing();

  console.log(`\n  🗂️  Album created: "${label}, ${album.country}" — cover: ${coverPhotoId} — ${insertedPhotos.length} photo(s)`);
}

async function truncateAlbums() {
  // Delete city_sets first (FK references photos), then orphaned cover photos
  await db.execute(sql`TRUNCATE TABLE city_sets RESTART IDENTITY CASCADE`);
  // Remove photos that were seeded as album covers (stored under cities/ or photos/ prefixes)
  await db.execute(
    sql`DELETE FROM photos WHERE city IS NOT NULL OR region IS NOT NULL`
  );
  console.log("  🗑️  Truncated city_sets and album photos.\n");
}

async function main() {
  console.log(`\n📂  Found ${ALL_ALBUMS.length} album(s) to seed: ${albumFiles.join(", ")}\n`);

  for (const albumData of ALL_ALBUMS) {
    await seedAlbum(albumData);
  }

  console.log("\n✨  Done.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});

