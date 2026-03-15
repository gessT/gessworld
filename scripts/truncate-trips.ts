import "dotenv/config";
import { db } from "@/db";
import { tripEnrollments, tripGallery, tripFeatures, tripTags, tripDepartures, trips } from "@/db/schema";

async function main() {
  console.log("\n🗑️  Truncating trips tables (FK order)...\n");

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

  console.log("\n✔  Done.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Truncate failed:", err);
  process.exit(1);
});
