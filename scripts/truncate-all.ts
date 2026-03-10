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
import { photos, citySets, categories, posts } from "@/db/schema";
import * as readline from "readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string) => new Promise<string>((res) => rl.question(q, res));

async function main() {
  console.log("\n⚠️  WARNING: This will permanently delete ALL data from:");
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
  // city_sets.coverPhotoId → photos.id, so city_sets must go first
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
