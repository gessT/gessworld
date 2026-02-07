import { s3Client } from "./server-client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BASE_URL = process.env.NEXT_PUBLIC_S3_PUBLIC_URL || "";

export const keyToUrl = (key: string | undefined | null) => {
  if (!key) {
    return "";
  }

  // If it's already a full URL (starts with http/https), return as-is
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }

  // Otherwise, it's a key - prepend the BASE_URL
  return `${BASE_URL}/${key}`;
};

/**
 * Generate a presigned URL for accessing private S3 objects
 * Use this on the server-side to create temporary access URLs
 */
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error("Failed to generate presigned URL:", error);
    return keyToUrl(key); // Fallback to public URL
  }
}
