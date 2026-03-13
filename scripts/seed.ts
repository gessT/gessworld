import "dotenv/config";
import { db } from "@/db";
import { photos, citySets, posts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
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
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
}

interface AlbumData {
  album: {
    country: string;
    countryCode: string;
    city: string;
    region?: string;
    description?: string;
  };
  photos: AlbumPhoto[];
}

interface PostData {
    title: string;
    slug: string;
    description?: string;
    coverImage?: string;
    cover_photo_url?: string;
    tags?: string[];
    content: string;
    visibility?: 'public' | 'private';
}

interface SeedData {
    album: AlbumData['album'];
    photos: AlbumPhoto[];
    post: PostData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Load all album JSON files from scripts/data/
// ─────────────────────────────────────────────────────────────────────────────
const DATA_DIR = resolve(__dirname, "data");
const dataFileNames = readdirSync(DATA_DIR).filter((file) =>
  file.endsWith(".json"),
);

console.log("Found data files:", dataFileNames);

// ─────────────────────────────────────────────────────────────────────────────
// Main seeding function
// ─────────────────────────────────────────────────────────────────────────────
async function seed() {
  for (const fileName of dataFileNames) {
    const filePath = join(DATA_DIR, fileName);
    const fileContent = readFileSync(filePath, "utf-8");
    const data: SeedData = JSON.parse(fileContent);

    const { album, photos: albumPhotos, post } = data;

    // 1. Skip if city already seeded
    const existing = await db
      .select({ id: citySets.id })
      .from(citySets)
      .where(and(eq(citySets.country, album.country), eq(citySets.city, album.city)))
      .limit(1);

    if (existing.length > 0) {
      console.log(`Skipping ${album.city} — already seeded.`);
      continue;
    }

    // 2. Seed photos first (coverPhotoId is required on citySets)
    if (!albumPhotos || albumPhotos.length === 0) {
      console.warn(`No photos found in ${fileName}, skipping.`);
      continue;
    }

    const photoValues = albumPhotos.map((p) => ({
      ...p,
      // Inherit geo from album if not set on individual photo
      country: p.country ?? album.country,
      countryCode: p.countryCode ?? album.countryCode,
      region: p.region ?? album.region,
      city: p.city ?? album.city,
      blurData: p.blurData ?? "",
      dateTimeOriginal: p.dateTimeOriginal ? new Date(p.dateTimeOriginal) : null,
    }));

    const insertedPhotos = await db.insert(photos).values(photoValues).returning();
    console.log(`Seeded ${insertedPhotos.length} photos for ${album.city}`);

    // 2. Pick cover: first favorite, or first photo
    const coverPhoto =
      insertedPhotos.find((p) => p.isFavorite) ?? insertedPhotos[0];

    // 3. Seed citySet with coverPhotoId
    await db.insert(citySets).values({
      country: album.country,
      countryCode: album.countryCode,
      city: album.city,
      description: album.description,
      coverPhotoId: coverPhoto.id,
    });

    console.log(`Seeded album for ${album.city}`);

    // 4. Seed post
    if (post) {
      await db.insert(posts).values({
        title: post.title,
        slug: post.slug,
        description: post.description,
        content: post.content,
        tags: post.tags,
        visibility: post.visibility ?? "public",
        coverImage: post.coverImage ?? post.cover_photo_url,
      }).onConflictDoNothing();
      console.log(`Seeded post: "${post.title}"`);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run the seeding
// ─────────────────────────────────────────────────────────────────────────────
seed()
  .then(() => {
    console.log("Seeding complete!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
