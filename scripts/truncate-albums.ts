import "dotenv/config";
import { db } from "@/db";
import { photos, citySets, posts } from "@/db/schema";

async function main() {
  console.log("\n🗑️  Truncating album tables (FK order)...\n");

  // citySets.coverPhotoId → photos.id, so citySets must go first
  await db.delete(citySets);
  console.log("  ✅  city_sets cleared");

  await db.delete(posts);
  console.log("  ✅  posts cleared");

  await db.delete(photos);
  console.log("  ✅  photos cleared");

  console.log("\n✔  Done.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Truncate failed:", err);
  process.exit(1);
});
