import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowLeft, Eye, EyeOff, Heart, Camera, Sparkles, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApertureSelector } from "../../aperture-selector";
import { ShutterSpeedSelector } from "../../shutter-speed-selector";
import { ISOSelector } from "../../iso-selector";
import { ExposureCompensationSelector } from "../../exposure-compensation-selector";
import { secondStepSchema, SecondStepData, MetadataStepProps } from "../types";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1 block">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputCls = "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-red-500 focus-visible:border-red-500/40 rounded-lg h-9 text-sm";
const textareaCls = "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-red-500 focus-visible:border-red-500/40 rounded-lg text-sm resize-none";

export function SecondStep({
  exif,
  onNext,
  onBack,
  initialData,
  isSubmitting,
}: MetadataStepProps) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const trpc = useTRPC();

  const generateTitle = useMutation(trpc.ai.generateTitle.mutationOptions());
  const generateDescription = useMutation(trpc.ai.generateDescription.mutationOptions());

  const form = useForm<SecondStepData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(secondStepSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      visibility: initialData?.visibility || "private",
      isFavorite: initialData?.isFavorite || false,
      make: initialData?.make,
      model: initialData?.model,
      lensModel: initialData?.lensModel,
      focalLength: initialData?.focalLength,
      focalLength35mm: initialData?.focalLength35mm,
      fNumber: initialData?.fNumber,
      iso: initialData?.iso,
      exposureTime: initialData?.exposureTime,
      exposureCompensation: initialData?.exposureCompensation,
      latitude: initialData?.latitude,
      longitude: initialData?.longitude,
    },
    mode: "onChange",
  });

  const getExifPayload = () => {
    const v = form.getValues();
    return {
      make: v.make || exif?.make,
      model: v.model || exif?.model,
      lensModel: v.lensModel || exif?.lensModel,
      focalLength35mm: v.focalLength35mm ?? exif?.focalLength35mm,
      fNumber: v.fNumber ?? exif?.fNumber,
      exposureTime: v.exposureTime ?? exif?.exposureTime,
      iso: v.iso ?? exif?.iso,
    };
  };

  const handleGenerateTitle = async () => {
    try {
      const result = await generateTitle.mutateAsync(getExifPayload());
      if (result.title) form.setValue("title", result.title, { shouldValidate: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Title generation failed");
    }
  };

  const handleGenerateDescription = async () => {
    const title = form.getValues("title");
    if (!title?.trim()) {
      toast.error("Enter a title first so AI can write a matching description.");
      return;
    }
    try {
      const result = await generateDescription.mutateAsync({ ...getExifPayload(), title });
      if (result.description) form.setValue("description", result.description, { shouldValidate: true });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Description generation failed");
    }
  };

  const { handleSubmit, formState, watch } = form;
  const { isValid } = formState;
  const visibility = watch("visibility");
  const isFavorite = watch("isFavorite");

  const onSubmit = (data: SecondStepData) => onNext(data);

  return (
    <>
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Basic info */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between mb-1">
                  <FieldLabel required>Title</FieldLabel>
                  <button
                    type="button"
                    onClick={handleGenerateTitle}
                    disabled={generateTitle.isPending}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {generateTitle.isPending
                      ? <><Loader2 className="w-3 h-3 animate-spin" /> Generating...</>
                      : <><Sparkles className="w-3 h-3" /> AI</>}
                  </button>
                </div>
                <FormControl>
                  <Input {...field} placeholder="Give your photo a name" className={inputCls} />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between mb-1">
                  <FieldLabel required>Description</FieldLabel>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={generateDescription.isPending}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {generateDescription.isPending
                      ? <><Loader2 className="w-3 h-3 animate-spin" /> Generating...</>
                      : <><Sparkles className="w-3 h-3" /> AI from title</>}
                  </button>
                </div>
                <FormControl>
                  <Textarea {...field} rows={3} placeholder="What's the story behind this shot?" className={textareaCls} />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          {/* Visibility + Favorite row */}
          <div className="flex items-center gap-3">
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <button
                    type="button"
                    onClick={() => field.onChange(field.value === "public" ? "private" : "public")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-bold transition-colors ${
                      field.value === "public"
                        ? "border-red-500/40 bg-red-600/10 text-red-400"
                        : "border-white/10 bg-white/5 text-white/40 hover:border-white/20"
                    }`}
                  >
                    {field.value === "public" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {field.value === "public" ? "Public" : "Private"}
                  </button>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFavorite"
              render={({ field }) => (
                <FormItem>
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-bold transition-colors ${
                      field.value
                        ? "border-red-500/40 bg-red-600/10 text-red-400"
                        : "border-white/10 bg-white/5 text-white/40 hover:border-white/20"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${field.value ? "fill-red-400" : ""}`} />
                    Favorite
                  </button>
                </FormItem>
              )}
            />
          </div>
        </div>


        {/* Camera params trigger */}
        <div className="border-t border-white/8 pt-5">
          <button
            type="button"
            onClick={() => setCameraOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white/8 group-hover:bg-white/12 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white/50" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Camera Parameters</p>
                <p className="text-[10px] text-white/25 mt-0.5">Make, model, lens, aperture, shutter, ISO...</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/25 group-hover:text-white/40 transition-colors" />
          </button>
        </div>

        <div className="flex justify-between pt-2">
          <button type="button" onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold uppercase tracking-wide px-4 py-2.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <button type="submit" disabled={isSubmitting || !isValid}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-wide px-5 py-2.5 rounded-lg transition-colors">
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </Form>

    <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
      <DialogContent className="bg-[#141414] border-white/10 text-white max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/8">
              <Camera className="w-4 h-4 text-white/60" />
            </div>
            <DialogTitle className="text-sm font-black uppercase tracking-tight text-white">
              Camera Parameters
            </DialogTitle>
          </div>
          {exif && (
            <p className="text-white/25 text-xs mt-2 pl-11">Auto-filled from EXIF - edit as needed</p>
          )}
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="make" render={({ field }) => (
                <FormItem>
                  <FieldLabel>Make</FieldLabel>
                  <FormControl><Input {...field} placeholder="Canon" className={inputCls} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="model" render={({ field }) => (
                <FormItem>
                  <FieldLabel>Model</FieldLabel>
                  <FormControl><Input {...field} placeholder="EOS R5" className={inputCls} /></FormControl>
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="lensModel" render={({ field }) => (
              <FormItem>
                <FieldLabel>Lens</FieldLabel>
                <FormControl><Input {...field} placeholder="RF 24-70mm f/2.8L" className={inputCls} /></FormControl>
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="focalLength" render={({ field }) => (
                <FormItem>
                  <FieldLabel>Focal Length (mm)</FieldLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.1" placeholder="50" value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      className={inputCls} />
                  </FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="focalLength35mm" render={({ field }) => (
                <FormItem>
                  <FieldLabel>35mm Equiv.</FieldLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.1" placeholder="50" value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      className={inputCls} />
                  </FormControl>
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-4 gap-3">
              <FormField control={form.control} name="fNumber" render={({ field }) => (
                <FormItem>
                  <FieldLabel>Aperture</FieldLabel>
                  <FormControl><ApertureSelector value={field.value} onChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="exposureTime" render={({ field }) => (
                <FormItem>
                  <FieldLabel>Shutter</FieldLabel>
                  <FormControl><ShutterSpeedSelector value={field.value} onChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="iso" render={({ field }) => (
                <FormItem>
                  <FieldLabel>ISO</FieldLabel>
                  <FormControl><ISOSelector value={field.value} onChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="exposureCompensation" render={({ field }) => (
                <FormItem>
                  <FieldLabel>EV</FieldLabel>
                  <FormControl><ExposureCompensationSelector value={field.value} onChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCameraOpen(false)}
                className="w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold uppercase tracking-wide transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
}
