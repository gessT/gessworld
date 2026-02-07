import "dotenv/config";
import { db } from "@/db";
import { photos, citySets } from "@/db/schema";

async function seedData() {
  try {
    console.log("🌱 Starting data seed...");

    // Create sample photos first (required for city_sets)
    const samplePhotos = await db
      .insert(photos)
      .values([
        {
          url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000",
          title: "Eiffel Tower at Sunset",
          description: "Beautiful sunset view of the iconic Eiffel Tower",
          aspectRatio: 1.5,
          width: 1200,
          height: 800,
          blurData: "data:image/jpeg;base64,...",
          city: "Paris",
          country: "France",
          countryCode: "FR",
          latitude: 48.8584,
          longitude: 2.2945,
        },
        {
          url: "https://images.unsplash.com/photo-1540959375944-7049f642e9f1?w=1000",
          title: "Tokyo Neon Streets",
          description: "Vibrant neon-lit streets of Tokyo",
          aspectRatio: 1.5,
          width: 1200,
          height: 800,
          blurData: "data:image/jpeg;base64,...",
          city: "Tokyo",
          country: "Japan",
          countryCode: "JP",
          latitude: 35.6762,
          longitude: 139.6503,
        },
        {
          url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1000",
          title: "New York Skyline",
          description: "Manhattan skyline at night",
          aspectRatio: 1.5,
          width: 1200,
          height: 800,
          blurData: "data:image/jpeg;base64,...",
          city: "New York",
          country: "United States",
          countryCode: "US",
          latitude: 40.7128,
          longitude: -74.006,
        },
        {
          url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1000",
          title: "Big Ben and Westminster",
          description: "Iconic Big Ben clock tower in London",
          aspectRatio: 1.5,
          width: 1200,
          height: 800,
          blurData: "data:image/jpeg;base64,...",
          city: "London",
          country: "United Kingdom",
          countryCode: "GB",
          latitude: 51.4975,
          longitude: -0.1357,
        },
      ])
      .returning();

    console.log(`✅ Created ${samplePhotos.length} sample photos`);

    // Create city sets with the photo IDs
    const citySetData = [
      {
        city: "Paris",
        country: "France",
        countryCode: "FR",
        coverPhotoId: samplePhotos[0].id,
      },
      {
        city: "Tokyo",
        country: "Japan",
        countryCode: "JP",
        coverPhotoId: samplePhotos[1].id,
      },
      {
        city: "New York",
        country: "United States",
        countryCode: "US",
        coverPhotoId: samplePhotos[2].id,
      },
      {
        city: "London",
        country: "United Kingdom",
        countryCode: "GB",
        coverPhotoId: samplePhotos[3].id,
      },
    ];

    const citySetsCreated = await db
      .insert(citySets)
      .values(citySetData)
      .returning();

    console.log(`✅ Created ${citySetsCreated.length} city sets`);
    console.log("🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seedData();
