import "dotenv/config";
import { db } from "@/db";
import { trips, tripTags, tripFeatures, tripGallery, tripEnrollments } from "@/db/schema";
import { eq } from "drizzle-orm";
import tripsData from "./data/trips.json";

// ─────────────────────────────────────────────────────────────────────────────
// Types that match the JSON shape
// ─────────────────────────────────────────────────────────────────────────────

type TripStatus = "draft" | "published" | "archived";
type TripDifficulty = "easy" | "moderate" | "adventurous";
type EnrollmentStatus = "pending" | "confirmed" | "cancelled" | "waitlisted";

interface TripSeedTag {
  label: string;
  sortOrder: number;
}

interface TripSeedFeature {
  label: string;
  iconKey: string;
  sortOrder: number;
}

interface TripSeedGallery {
  photoId: string;
  caption?: string;
  sortOrder?: number;
}

interface TripSeedEnrollment {
  userId: string;
  status?: EnrollmentStatus;
  note?: string;
}

interface TripSeedRecord {
  title: string;
  subtitle: string;
  description?: string;
  accentGradient?: string;
  locationLabel: string;
  durationDays: number;
  bestSeasonLabel?: string;
  departureDateStart?: string;
  departureDateEnd?: string;
  priceUsd: number;
  minGroupSize?: number;
  maxGroupSize?: number;
  status: TripStatus;
  difficulty: TripDifficulty;
  tags: TripSeedTag[];
  features: TripSeedFeature[];
  gallery: TripSeedGallery[];
  enrollments: TripSeedEnrollment[];
}

const data = tripsData as TripSeedRecord[];

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🌍 Seeding ${data.length} trips...\n`);

  let inserted = 0;
  let skipped = 0;

  for (const record of data) {
    // ── Idempotency: skip if a trip with the same title already exists ────
    const existing = await db
      .select({ id: trips.id })
      .from(trips)
      .where(eq(trips.title, record.title))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  ⏭  Skipped  "${record.title}" (already exists)`);
      skipped++;
      continue;
    }

    // ── Insert trip ───────────────────────────────────────────────────────
    const [trip] = await db
      .insert(trips)
      .values({
        title: record.title,
        subtitle: record.subtitle,
        description: record.description,
        accentGradient: record.accentGradient,
        locationLabel: record.locationLabel,
        durationDays: record.durationDays,
        bestSeasonLabel: record.bestSeasonLabel,
        departureDateStart: record.departureDateStart
          ? new Date(record.departureDateStart)
          : undefined,
        departureDateEnd: record.departureDateEnd
          ? new Date(record.departureDateEnd)
          : undefined,
        priceUsd: record.priceUsd,
        minGroupSize: record.minGroupSize,
        maxGroupSize: record.maxGroupSize,
        status: record.status,
        difficulty: record.difficulty,
      })
      .returning();

    const tripId = trip.id;

    // ── Insert tags ───────────────────────────────────────────────────────
    if (record.tags.length > 0) {
      await db.insert(tripTags).values(
        record.tags.map((tag) => ({
          tripId,
          label: tag.label,
          sortOrder: tag.sortOrder,
        }))
      );
    }

    // ── Insert features ───────────────────────────────────────────────────
    if (record.features.length > 0) {
      await db.insert(tripFeatures).values(
        record.features.map((feat) => ({
          tripId,
          label: feat.label,
          iconKey: feat.iconKey,
          sortOrder: feat.sortOrder,
        }))
      );
    }

    // ── Insert gallery entries (requires valid photo UUIDs in DB) ─────────
    if (record.gallery.length > 0) {
      await db.insert(tripGallery).values(
        record.gallery.map((g, i) => ({
          tripId,
          photoId: g.photoId,
          caption: g.caption,
          sortOrder: g.sortOrder ?? i,
        }))
      );
      console.log(`       📸 ${record.gallery.length} gallery photo(s) linked`);
    }

    // ── Insert enrollments (requires valid user IDs in DB) ────────────────
    if (record.enrollments.length > 0) {
      await db.insert(tripEnrollments).values(
        record.enrollments.map((e) => ({
          tripId,
          userId: e.userId,
          status: e.status ?? "pending",
          note: e.note,
        }))
      );
      console.log(`       👤 ${record.enrollments.length} enrollment(s) added`);
    }

    console.log(`  ✅ Inserted "${record.title}" [${record.status}] → ${tripId}`);
    inserted++;
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`   Inserted : ${inserted}`);
  console.log(`   Skipped  : ${skipped}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
