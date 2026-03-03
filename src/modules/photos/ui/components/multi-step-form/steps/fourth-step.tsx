import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Form } from "@/components/ui/form";
import { fourthStepSchema, FourthStepData, StepProps } from "../types";
import { PhotoPreviewCard } from "../../photo-preview-card";

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

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {initialData?.url && initialData?.imageInfo && (
          <PhotoPreviewCard
            url={initialData.url}
            title={initialData.title}
            imageInfo={initialData.imageInfo}
            make={initialData?.make || initialData?.exif?.make}
            model={initialData?.model || initialData?.exif?.model}
            lensModel={initialData?.lensModel || initialData?.exif?.lensModel}
            focalLength35mm={initialData?.focalLength35mm || initialData?.exif?.focalLength35mm}
            fNumber={initialData?.fNumber || initialData?.exif?.fNumber}
            exposureTime={initialData?.exposureTime || initialData?.exif?.exposureTime}
            iso={initialData?.iso || initialData?.exif?.iso}
            dateTimeOriginal={
              initialData?.exif?.dateTimeOriginal
                ? initialData.exif.dateTimeOriginal.toString()
                : undefined
            }
            className="w-full"
          />
        )}

        <div className="flex justify-between pt-2">
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
              <><Send className="h-4 w-4" /> Publish Photo</>
            )}
          </button>
        </div>
      </form>
    </Form>
  );
}
