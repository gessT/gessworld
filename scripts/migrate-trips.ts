/**
 * migrate-trips.ts
 * ─────────────────
 * Creates the trips-related tables if they don't already exist.
 * Safe to run multiple times (all statements use IF NOT EXISTS).
 *
 * Usage:
 *   npx tsx scripts/migrate-trips.ts
 */

import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

const SQL = /* sql */ `
-- ── Enums ─────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE "public"."trip_status" AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."trip_difficulty" AS ENUM ('easy', 'moderate', 'adventurous');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "public"."enrollment_status" AS ENUM ('pending', 'confirmed', 'cancelled', 'waitlisted');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── trips ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "trips" (
  "id"                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title"               text NOT NULL,
  "subtitle"            text NOT NULL,
  "description"         text,
  "cover_photo_id"      uuid REFERENCES "photos"("id"),
  "accent_gradient"     text,
  "city_set_id"         uuid REFERENCES "city_sets"("id"),
  "location_label"      text NOT NULL,
  "duration_days"       integer NOT NULL,
  "best_season_label"   text,
  "departure_date_start" timestamp,
  "departure_date_end"  timestamp,
  "price_usd"           integer NOT NULL,
  "min_group_size"      integer DEFAULT 1,
  "max_group_size"      integer DEFAULT 10,
  "post_id"             uuid REFERENCES "posts"("id"),
  "status"              "trip_status" NOT NULL DEFAULT 'draft',
  "difficulty"          "trip_difficulty" NOT NULL DEFAULT 'moderate',
  "created_at"          timestamp NOT NULL DEFAULT now(),
  "updated_at"          timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "trip_status_idx"    ON "trips" ("status");
CREATE INDEX IF NOT EXISTS "trip_city_set_idx"  ON "trips" ("city_set_id");
CREATE INDEX IF NOT EXISTS "trip_departure_idx" ON "trips" ("departure_date_start");

-- ── trip_tags ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "trip_tags" (
  "id"         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "trip_id"    uuid NOT NULL REFERENCES "trips"("id") ON DELETE CASCADE,
  "label"      text NOT NULL,
  "sort_order" integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS "trip_tags_trip_idx" ON "trip_tags" ("trip_id");

-- ── trip_features ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "trip_features" (
  "id"         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "trip_id"    uuid NOT NULL REFERENCES "trips"("id") ON DELETE CASCADE,
  "label"      text NOT NULL,
  "icon_key"   varchar(64),
  "sort_order" integer NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS "trip_features_trip_idx" ON "trip_features" ("trip_id");

-- ── trip_gallery ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "trip_gallery" (
  "id"         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "trip_id"    uuid NOT NULL REFERENCES "trips"("id") ON DELETE CASCADE,
  "photo_id"   uuid NOT NULL REFERENCES "photos"("id") ON DELETE CASCADE,
  "caption"    text,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "trip_gallery_trip_idx"  ON "trip_gallery" ("trip_id");
CREATE UNIQUE INDEX IF NOT EXISTS "trip_gallery_unique" ON "trip_gallery" ("trip_id", "photo_id");

-- ── trip_enrollments ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "trip_enrollments" (
  "id"         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "trip_id"    uuid NOT NULL REFERENCES "trips"("id") ON DELETE CASCADE,
  "user_id"    text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "status"     "enrollment_status" NOT NULL DEFAULT 'pending',
  "note"       text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "enrollment_trip_idx"   ON "trip_enrollments" ("trip_id");
CREATE INDEX IF NOT EXISTS "enrollment_user_idx"   ON "trip_enrollments" ("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "enrollment_unique" ON "trip_enrollments" ("trip_id", "user_id");
`;

async function main() {
  const client = await pool.connect();
  try {
    console.log("Running trips migration…");
    await client.query(SQL);
    console.log("✓ trips, trip_tags, trip_features, trip_gallery, trip_enrollments created (or already exist).");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
