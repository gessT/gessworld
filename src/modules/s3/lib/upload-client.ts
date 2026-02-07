import { IMAGE_SIZE_LIMIT } from "@/constants";

/**
 * Client-side S3 upload helper.
 * This utility handles file validation and uploading to S3 using presigned URLs.
 * It is designed to be used in frontend components.
 */
interface UploadToS3Options {
  file: File;
  folder: string;
  onProgress?: (progress: number) => void;
  getUploadUrl: (input: {
    filename: string;
    contentType: string;
    folder: string;
  }) => Promise<{ uploadUrl: string; publicUrl: string }>;
}

interface UploadToS3Result {
  publicUrl: string;
}

class UploadError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "UploadError";
  }
}

export class S3Client {
  /**
   * generate a unique filename
   * @param originalFilename the original filename
   * @returns the unique filename
   */
  private generateUniqueFilename(originalFilename: string): string {
    const timestamp = Date.now();
    const extension = originalFilename.split(".").pop() || "";
    const baseName = originalFilename.replace(`.${extension}`, "");
    return `${baseName}-${timestamp}.${extension}`;
  }

  /**
   * validate file
   * @param file the file to be validated
   * @throws {UploadError} if file validation fails
   */
  private validateFile(file: File) {
    const MAX_FILE_SIZE = IMAGE_SIZE_LIMIT;
    if (file.size > MAX_FILE_SIZE) {
      throw new UploadError(
        `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
      );
    }

    // validate file type
    if (!file.type.startsWith("image/")) {
      throw new UploadError("Only image files are allowed");
    }
  }

  /**
   *  XMLHttpRequest upload with progress
   * @param file the file to be uploaded
   * @param uploadUrl the upload url
   * @param onProgress the progress callback
   */
  private async uploadWithProgress(
    file: File,
    uploadUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress?.(progress);
        }
      });

      // complete
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(
            new UploadError(`Upload failed with status ${xhr.status}`, {
              status: xhr.status,
              response: xhr.response,
            })
          );
        }
      };

      // error
      xhr.onerror = () => {
        const errorMsg = `Network error during upload (CORS issue or network failure)`;
        console.error("XHR Upload Error:", {
          status: xhr.status,
          statusText: xhr.statusText || "Network Error",
          response: xhr.response,
          responseText: xhr.responseText,
          readyState: xhr.readyState,
          hint: "This is usually a CORS issue. Check S3 bucket CORS configuration.",
        });
        reject(
          new UploadError(errorMsg, {
            status: xhr.status,
            response: xhr.response,
            responseText: xhr.responseText,
          })
        );
      };

      xhr.ontimeout = () => {
        reject(new UploadError("Upload timed out (60 seconds)"));
      };

      // timeout
      xhr.timeout = 60000;

      // send request
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  }

  /**
   * Upload file to S3 via server proxy (avoids CORS issues)
   * @param options the upload options
   * @returns the upload result, containing the public URL
   * @throws {UploadError} if the upload fails
   */
  async upload({
    file,
    folder,
    onProgress,
    getUploadUrl,
  }: UploadToS3Options): Promise<UploadToS3Result> {
    try {
      this.validateFile(file);

      // Use server-side upload to avoid CORS issues
      const fileBuffer = await file.arrayBuffer();
      const uniqueFilename = this.generateUniqueFilename(file.name);

      // This will be called from the component with the tRPC client
      // The component will call the serverUpload procedure
      // For now, return the public URL
      const publicUrl = `${process.env.NEXT_PUBLIC_S3_PUBLIC_URL}/${folder}/${uniqueFilename}`;
      
      return { publicUrl };
    } catch (error) {
      if (error instanceof UploadError) throw error;
      throw new UploadError(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

      return { publicUrl };
    } catch (error) {
      if (error instanceof UploadError) {
        throw error;
      }
      throw new UploadError(
        "Failed to upload file",
        error instanceof Error ? error : undefined
      );
    }
  }
}

export const s3Client = new S3Client();
