import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Send, Camera, Aperture, Timer, Zap, Calendar } from "lucide-react";
import { Form } from "@/components/ui/form";
import { fourthStepSchema, FourthStepData, StepProps } from "../types";
import BlurImage from "@/components/blur-image";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { formatExposureTime } from "@/modules/photos/lib/utils";

export function FourthStep({
  onNext,
  onBack,
  initialData,
  isSubmitting,
}: StepProps) {
  const form = useForm<FourthStepData>({
    resolver: zodResolver(fourthStepSchema),
    defaultValues: {},
    mode: "onChange",
  });

  const { handleSubmit, formState } = form;
  const { isValid } = formState;

  const onSubmit = (data: FourthStepData) => onNext(data);

  const make = initialData?.make || initialData?.exif?.make;
  const model = initialData?.model || initialData?.exif?.model;
  const lensModel = initialData?.lensModel || initialData?.exif?.lensModel;
  const focalLength35mm = initialData?.focalLength35mm || initialData?.exif?.focalLength35mm;
  const fNumber = initialData?.fNumber || initialData?.exif?.fNumber;
  const exposureTime = initialData?.exposureTime || initialData?.exif?.exposureTime;
  const iso = initialData?.iso || initialData?.exif?.iso;
  const dateTimeOriginal = initialData?.exif?.dateTimeOriginal
    ? new Date(initialData.exif.dateTimeOriginal).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : undefined;

  const exifPills = [
    { icon: Camera, value: focalLength35mm ? `${focalLength35mm}mm` : null },
    { icon: Aperture, value: fNumber ? `ƒ/${fNumber}` : null },
    { icon: Timer, value: exposureTime ? formatExposureTime(exposureTime) : null },
    { icon: Zap, value: iso ? `ISO ${iso}` : null },
    { icon: Calendar, value: dateTimeOriginal ?? null },
  ].filter((p) => p.value !== null);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Compact preview */}
        {initialData?.url && initialData?.imageInfo && (
          <div className="flex gap-4 items-start rounded-xl border border-white/8 bg-white/3 p-3">
            {/* Thumbnail */}
            <div
              className="relative flex-shrink-0 rounded-lg overflow-hidden bg-[#141414]"
              style={{
                width: 90,
                height: 90,
              }}
            >
              <BlurImage
                src={initialData.url.startsWith("blob:") ? initialData.url : keyToUrl(initialData.url)}
                alt={initialData.title || "Preview"}
                fill
                blurhash={initialData.imageInfo.blurhash}
                className="object-cover"
                sizes="90px"
              />
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0 py-0.5 space-y-2">
              {initialData.title && (
                <p className="text-white font-bold text-sm leading-tight truncate">
                  {initialData.title}
                </p>
              )}
              {(make || model) && (
                <p className="text-white/40 text-xs truncate">{[make, model].filter(Boolean).join(" ")}</p>
              )}
              {lensModel && (
                <p className="text-white/30 text-[10px] truncate">{lensModel}</p>
              )}
            </div>
          </div>
        )}

        {/* EXIF pills */}
        {exifPills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {exifPills.map(({ icon: Icon, value }) => (
              <span
                key={value}
                className="inline-flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white/50"
              >
                <Icon className="w-3 h-3 text-red-400/70" />
                {value}
              </span>
            ))}
          </div>
        )}

        {/* Ready prompt */}
        <div className="rounded-xl border border-red-500/15 bg-red-600/5 px-4 py-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
          <p className="text-white/50 text-xs leading-relaxed">
            Ready to publish. This will make your photo visible according to its visibility setting.
          </p>
        </div>

        <div className="flex justify-between pt-1">
          <button type="button" onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold uppercase tracking-wide px-4 py-2.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-wide px-5 py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Publishing...</>
            ) : (
              <><Send className="h-4 w-4" /> Publish</>
            )}
          </button>
        </div>
      </form>
    </Form>
  );
}
