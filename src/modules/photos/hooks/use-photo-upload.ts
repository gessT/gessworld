import { useState } from "react";
import { toast } from "sonner";
import {
  type TExifData,
  type TImageInfo,
  getPhotoExif,
  getImageInfo,
} from "@/modules/photos/lib/utils";
import { DEFAULT_PHOTOS_UPLOAD_FOLDER } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface UsePhotoUploadProps {
  folder?: string;
  onUploadSuccess?: (
    url: string,
    exif: TExifData | null,
    imageInfo: TImageInfo
  ) => void;
}

export function usePhotoUpload({
  folder = DEFAULT_PHOTOS_UPLOAD_FOLDER,
  onUploadSuccess,
}: UsePhotoUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [exif, setExif] = useState<TExifData | null>(null);
  const [imageInfo, setImageInfo] = useState<TImageInfo | null>(null);

  const trpc = useTRPC();
  const serverUpload = useMutation(
    trpc.s3.serverUpload.mutationOptions()
  );

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const [exifData, imgInfo] = await Promise.all([
        getPhotoExif(file),
        getImageInfo(file),
      ]);
      setExif(exifData);
      setImageInfo(imgInfo);

      // Simulate progress for server upload
      setUploadProgress(50);

      // Generate unique filename
      const timestamp = Date.now();
      const extension = file.name.split(".").pop() || "";
      const baseName = file.name.replace(`.${extension}`, "");
      const uniqueFilename = `${baseName}-${timestamp}.${extension}`;

      // Convert file to base64
      const fileBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(fileBuffer);
      const binaryString = uint8Array.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
      const base64String = btoa(binaryString);

      const result = await serverUpload.mutateAsync({
        filename: uniqueFilename,
        contentType: file.type,
        folder,
        fileBuffer: base64String,
      });

      setUploadProgress(100);
      setUploadedImageUrl(result.publicUrl);
      toast.success("Photo uploaded successfully!");
      onUploadSuccess?.(result.publicUrl, exifData, imgInfo);
    } catch (error) {
      setExif(null);
      setImageInfo(null);
      setUploadedImageUrl(null);

      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload photo"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadedImageUrl,
    exif,
    imageInfo,
    handleUpload,
  };
}
