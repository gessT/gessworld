import "dotenv/config";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

async function testS3Connection() {
  try {
    console.log("🧪 Testing S3 Connection...");
    console.log("S3_ENDPOINT:", process.env.S3_ENDPOINT);
    console.log("S3_BUCKET_NAME:", process.env.S3_BUCKET_NAME);
    console.log("S3_ACCESS_KEY_ID:", process.env.S3_ACCESS_KEY_ID?.substring(0, 5) + "***");

    const s3Client = new S3Client({
      region: "ap-southeast-1",
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });

    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);

    console.log("\n✅ Connected to S3!");
    console.log("Available buckets:");
    response.Buckets?.forEach((bucket) => {
      console.log(`  - ${bucket.Name}`);
    });

    const bucketExists = response.Buckets?.some(
      (b) => b.Name === process.env.S3_BUCKET_NAME
    );
    if (bucketExists) {
      console.log(`✅ Bucket "${process.env.S3_BUCKET_NAME}" found!`);
    } else {
      console.log(`❌ Bucket "${process.env.S3_BUCKET_NAME}" NOT found!`);
      console.log("Please create the bucket or update S3_BUCKET_NAME in .env");
    }
  } catch (error) {
    console.error("❌ S3 Connection Failed:", error);
    process.exit(1);
  }
}

testS3Connection();
