import "dotenv/config";
import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";

async function configureCORS() {
  try {
    console.log("🔧 Configuring S3 CORS...");

    const s3Client = new S3Client({
      region: "ap-southeast-1",
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });

    const corsConfiguration = {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
          AllowedOrigins: [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://192.168.31.214:3000",
          ],
          ExposeHeaders: ["ETag", "x-amz-version-id"],
          MaxAgeSeconds: 3000,
        },
      ],
    };

    const command = new PutBucketCorsCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      CORSConfiguration: corsConfiguration,
    });

    await s3Client.send(command);

    console.log(`✅ CORS configured successfully for bucket: ${process.env.S3_BUCKET_NAME}`);
    console.log("\nCORS Rules Applied:");
    console.log("- Allowed Methods: GET, PUT, POST, DELETE, HEAD");
    console.log("- Allowed Origins: localhost:3000, 192.168.31.214:3000");
    console.log("- Allowed Headers: *");
  } catch (error) {
    console.error("❌ Failed to configure CORS:", error);
    process.exit(1);
  }
}

configureCORS();
