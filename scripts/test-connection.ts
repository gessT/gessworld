import "dotenv/config";
import pg from "pg";

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;

  console.log("🔍 Testing Supabase Connection...");
  console.log(
    "Database URL:",
    connectionString?.substring(0, 50) + "..."
  );

  const client = new pg.Client({ connectionString });

  try {
    console.log("⏳ Connecting...");
    await client.connect();
    console.log("✅ Connected to Supabase!");

    // Check if tables exist
    console.log("\n🔍 Checking tables...");
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("✅ Tables found:");
    result.rows.forEach((row: any) => {
      console.log(`   - ${row.table_name}`);
    });

    // Try to query photos
    console.log("\n🔍 Querying photos table...");
    const photosResult = await client.query(
      "SELECT COUNT(*) as count FROM photos"
    );
    console.log(
      `✅ Photos count: ${photosResult.rows[0].count}`
    );
  } catch (error) {
    console.error(
      "❌ Connection Error:",
      error instanceof Error ? error.message : error
    );
  } finally {
    await client.end();
    console.log("\n✅ Connection test complete");
  }
}

testConnection();
