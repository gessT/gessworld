import { NextRequest, NextResponse } from "next/server";
import { getPresignedUrl } from "@/modules/s3/lib/key-to-url";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { error: "Missing key parameter" },
        { status: 400 }
      );
    }

    const url = await getPresignedUrl(key, 3600); // 1 hour expiry
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
