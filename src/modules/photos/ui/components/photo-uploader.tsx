"use client";

import { usePhotoUpload } from "../../hooks/use-photo-upload";
import { UploadZone } from "./upload-zone";
import type { TExifData, TImageInfo } from "@/modules/photos/lib/utils";

interface PhotoUploaderProps {
  onUploadSuccess?: (
    url: string,
    exif: TExifData | null,
    imageInfo: TImageInfo,
    file?: File
  ) => void;
  folder?: string;
  deferUpload?: boolean;
  onCreateSuccess?: () => void;
}

export function PhotoUploader({ onUploadSuccess, folder, deferUpload }: PhotoUploaderProps) {
  const { isUploading, handleUpload, uploadProgress } = usePhotoUpload({
    folder,
    deferUpload,
    onUploadSuccess,
  });

  return (
    <UploadZone
      isUploading={isUploading}
      onUpload={handleUpload}
      uploadProgress={uploadProgress}
    />
  );
}
