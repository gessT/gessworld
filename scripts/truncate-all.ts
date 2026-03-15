/**
 * truncate-all.ts
 * ───────────────
 * Deletes ALL rows from every application table.
 * Auth tables (user, session, account, verification) are preserved by default.
 *
 * Usage:
 *   bun run db:truncate
 *
 * ⚠️  DESTRUCTIVE — this cannot be undone.
 *     You will be prompted to confirm before anything is deleted.
 */

import "dotenv/config";
import { db } from "@/db";
import { photos, citySets, categories, posts, trips, tripDepartures, tripTags, tripFeatures, tripGallery, tripEnrollments } from "@/db/schema";
import * as readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string) => new Promise<string>((res) => rl.question(q, res));

async function main() {
  console.log("\n⚠️  WARNING: This will permanently delete ALL data from:");
  console.log("   • trip enrollments, gallery, features, tags, departures");
  console.log("   • trips");
  console.log("   • photos");
  console.log("   • city_sets");
  console.log("   • categories");
  console.log("   • posts");
  console.log("   (user / session / account / verification are kept)\n");

  const answer = await ask('Type "yes" to confirm: ');
  rl.close();

  if (answer.trim().toLowerCase() !== "yes") {
    console.log("\n❌  Aborted — nothing was deleted.\n");
    process.exit(0);
  }

  console.log("\n🗑️  Truncating tables…\n");

  // Delete in dependency order (child → parent to satisfy FK constraints)
  // trips.coverPhotoId → photos.id, so trips (and its children) must go first
  await db.delete(tripEnrollments);
  console.log("  ✅  trip_enrollments cleared");

  await db.delete(tripGallery);
  console.log("  ✅  trip_gallery cleared");

  await db.delete(tripFeatures);
  console.log("  ✅  trip_features cleared");

  await db.delete(tripTags);
  console.log("  ✅  trip_tags cleared");

  await db.delete(tripDepartures);
  console.log("  ✅  trip_departures cleared");

  await db.delete(trips);
  console.log("  ✅  trips cleared");

  await db.delete(posts);
  console.log("  ✅  posts cleared");

  await db.delete(categories);
  console.log("  ✅  categories cleared");

  await db.delete(citySets);
  console.log("  ✅  city_sets cleared");

  await db.delete(photos);
  console.log("  ✅  photos cleared");

  console.log("\n✨  Done. Database is empty.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌  Truncation failed:", err);
  process.exit(1);
});
