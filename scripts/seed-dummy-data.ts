import "dotenv/config";
import { db } from "@/db";
import { photos, citySets, categories, posts } from "@/db/schema";

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

    // Create categories
    const categoriesCreated = await db
      .insert(categories)
      .values([
        { name: "Travel" },
        { name: "Photography Tips" },
        { name: "Destination Guide" },
        { name: "Behind the Scenes" },
      ])
      .returning();

    console.log(`✅ Created ${categoriesCreated.length} categories`);

    // Create dummy posts
    const postsCreated = await db
      .insert(posts)
      .values([
        {
          title: "Exploring Paris: A Photographer's Guide",
          slug: "exploring-paris-photographers-guide",
          categoryId: categoriesCreated[2].id,
          visibility: "public",
          tags: ["paris", "travel", "photography", "france"],
          description: "Discover the best photo spots in Paris",
          content: "<p>Paris is a photographer's paradise...</p>",
          readingTimeMinutes: 5,
        },
        {
          title: "5 Essential Photography Tips",
          slug: "5-essential-photography-tips",
          categoryId: categoriesCreated[1].id,
          visibility: "public",
          tags: ["photography", "tips", "beginner"],
          description: "Learn the fundamentals of photography",
          content: "<p>Whether you're a beginner or an experienced photographer...</p>",
          readingTimeMinutes: 8,
        },
        {
          title: "Tokyo After Dark: Urban Photography",
          slug: "tokyo-after-dark-urban-photography",
          categoryId: categoriesCreated[0].id,
          visibility: "public",
          tags: ["tokyo", "travel", "urban", "night"],
          description: "Capturing the neon-lit streets of Tokyo",
          content: "<p>Tokyo transforms after sunset...</p>",
          readingTimeMinutes: 6,
        },
        {
          title: "Behind the Scenes: A Day in My Life",
          slug: "behind-the-scenes-day-in-my-life",
          categoryId: categoriesCreated[3].id,
          visibility: "public",
          tags: ["behind-the-scenes", "lifestyle"],
          description: "An insider's look at my photography process",
          content: "<p>Many people ask what a typical day looks like for a photographer...</p>",
          readingTimeMinutes: 7,
        },
      ])
      .returning();

    console.log(`✅ Created ${postsCreated.length} dummy posts`);
    console.log("🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seedData();
