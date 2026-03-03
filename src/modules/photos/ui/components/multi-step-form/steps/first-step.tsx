import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BlurImage from "@/components/blur-image";
import { CheckCircle2, Copy, Check, ArrowRight, RefreshCw } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { PhotoUploader } from "../../photo-uploader";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { firstStepSchema, FirstStepData, UploadStepProps } from "../types";
import { DEFAULT_PHOTOS_UPLOAD_FOLDER } from "@/constants";

export function FirstStep({
  url,
  imageInfo,
  onUploadSuccess,
  onReupload,
  onNext,
  initialData,
}: UploadStepProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const form = useForm<FirstStepData>({
    resolver: zodResolver(firstStepSchema),
    defaultValues: { url: initialData?.url || "" },
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const handleCopyUrl = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getPresignedImageUrl = async (key: string) => {
    try {
      let objectKey = key;
      if (key.startsWith("http")) {
        const u = new URL(key);
        objectKey = u.pathname.substring(1);
      }
      const response = await fetch(`/api/s3/presigned-url?key=${encodeURIComponent(objectKey)}`);
      if (!response.ok) throw new Error("Failed to get presigned URL");
      const data = await response.json();
      return data.url;
    } catch {
      return keyToUrl(key);
    }
  };

  const onSubmit = (data: FirstStepData) => onNext(data);
  const isStepValid = !!url;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {!url || !imageInfo ? (
          <>
            <PhotoUploader
              folder={DEFAULT_PHOTOS_UPLOAD_FOLDER}
              deferUpload={true}
              onUploadSuccess={(url, exif, imageInfo, file) => {
                onUploadSuccess(url, exif, imageInfo, file);
                form.setValue("url", url, { shouldValidate: true });
                // blob: URLs are already local — no presigned URL needed
                if (url.startsWith("blob:")) {
                  setImageUrl(url);
                } else {
                  getPresignedImageUrl(url).then(setImageUrl);
                }
              }}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ fieldState }) => (
                <FormItem>{fieldState.error && <FormMessage />}</FormItem>
              )}
            />
          </>
        ) : (
          <div className="space-y-4">
            {/* Success badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-widest">
                <CheckCircle2 className="h-4 w-4" />
                Upload complete
              </div>
              <button
                type="button"
                onClick={() => onReupload(url)}
                className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Re-upload
              </button>
            </div>

            {/* Preview */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/8 bg-[#141414]">
              <BlurImage
                blurhash={imageInfo.blurhash}
                src={imageUrl || (url.startsWith("blob:") ? url : keyToUrl(url))}
                alt="Uploaded photo"
                fill
                className="object-contain w-full h-full"
                unoptimized
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1 text-white/60 text-[10px] font-mono">
                {imageInfo.width} × {imageInfo.height}px
              </div>
            </div>

            {/* Key */}
            {/* <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">S3 Key</label>
              <InputGroup>
                <InputGroupInput value={url} readOnly className="font-mono text-xs bg-white/5 border-white/10 text-white/60" />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton onClick={handleCopyUrl} size="icon-xs" aria-label="Copy key">
                    {isCopied ? <Check className="h-3.5 w-3.5 text-red-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div> */}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!isStepValid}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-wide px-5 py-2.5 rounded-lg transition-colors"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </Form>
  );
}
