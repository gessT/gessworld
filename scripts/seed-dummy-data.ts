import "dotenv/config";
import { db } from "@/db";
import { photos, citySets, categories, posts } from "@/db/schema";
import * as fs from "fs";
import * as path from "path";

interface DummyData {
  photos: any[];
  categories: any[];
  posts: any[];
}

async function seedData() {
  try {
    console.log("🌱 Starting data seed...");

    // Load data from JSON file
    const dataFilePath = path.join(__dirname, "dummy-data.json");
    const rawData = fs.readFileSync(dataFilePath, "utf-8");
    const dummyData: DummyData = JSON.parse(rawData);

    // Create sample photos first (required for city_sets)
    const samplePhotos = await db
      .insert(photos)
      .values(dummyData.photos)
      .returning();

    console.log(`✅ Created ${samplePhotos.length} sample photos`);

    // Create city sets with the photo IDs
    const citySetData = dummyData.photos.map((photo, index) => ({
      city: photo.city,
      country: photo.country,
      countryCode: photo.countryCode,
      coverPhotoId: samplePhotos[index].id,
    }));

    const citySetsCreated = await db
      .insert(citySets)
      .values(citySetData)
      .returning();

    console.log(`✅ Created ${citySetsCreated.length} city sets`);

    // Create categories
    const categoriesCreated = await db
      .insert(categories)
      .values(dummyData.categories)
      .returning();

    console.log(`✅ Created ${categoriesCreated.length} categories`);

    // Create dummy posts
    const postsData = dummyData.posts.map((post) => ({
      ...post,
      categoryId: categoriesCreated[post.categoryIndex].id,
      categoryIndex: undefined, // Remove the index field
    }));

    const postsCreated = await db
      .insert(posts)
      .values(postsData)
      .returning();

    console.log(`✅ Created ${postsCreated.length} dummy posts`);
    console.log("🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seedData();
