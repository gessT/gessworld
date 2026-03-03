import "dotenv/config";
import { db } from "@/db";
import { photos, citySets, categories, posts } from "@/db/schema";

async function cleanData() {
  try {
    console.log("🗑️  Starting data cleanup...");

    // Delete in correct order due to foreign keys
    // Delete posts first (no foreign key dependents)
    const deletedPosts = await db.delete(posts).returning();
    console.log(`✅ Deleted ${deletedPosts.length} posts`);

    // Delete categories
    const deletedCategories = await db.delete(categories).returning();
    console.log(`✅ Deleted ${deletedCategories.length} categories`);

    // Delete city sets (has reference to photos)
    const deletedCitySets = await db.delete(citySets).returning();
    console.log(`✅ Deleted ${deletedCitySets.length} city sets`);

    // Delete photos (last since city sets reference it)
    const deletedPhotos = await db.delete(photos).returning();
    console.log(`✅ Deleted ${deletedPhotos.length} photos`);

    console.log("🎉 Cleanup completed successfully!");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  }
}

cleanData();
