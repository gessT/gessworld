"use client";

import { useState, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Upload, X, MapPin, Loader2 } from "lucide-react";
import Image from "next/image";

interface AddCityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ImagePreview {
  dataUrl: string;
  base64: string;
  type: string;
  name: string;
  width: number;
  height: number;
}

export function AddCityDialog({ open, onOpenChange }: AddCityDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: createCity, isPending } = useMutation(
    trpc.city.create.mutationOptions()
  );

  const handleClose = () => {
    setCity("");
    setCountry("");
    setCountryCode("");
    setDescription("");
    setImagePreview(null);
    onOpenChange(false);
  };

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1]! : dataUrl;
        setImagePreview({
          dataUrl,
          base64,
          type: file.type,
          name: file.name,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      toast.error("Please select a cover image");
      return;
    }
    createCity(
      {
        city,
        country,
        countryCode: countryCode.toUpperCase(),
        description: description.trim() || undefined,
        coverImageBase64: imagePreview.base64,
        coverImageType: imagePreview.type,
        coverImageName: imagePreview.name,
        coverImageWidth: imagePreview.width,
        coverImageHeight: imagePreview.height,
      },
      {
        onSuccess: () => {
          toast.success(`${city} album created!`);
          queryClient.invalidateQueries(trpc.city.getMany.queryOptions());
          handleClose();
        },
        onError: (err) => {
          toast.error(err.message ?? "Failed to create city album");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#141414] border border-white/10 text-white max-w-lg p-0 overflow-hidden gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-white font-black uppercase tracking-tight text-lg">
                New City Album
              </DialogTitle>
              <DialogDescription className="text-white/40 text-xs mt-0.5">
                Create a new destination in your collection
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Cover Image Upload */}
          <div className="space-y-2">
            <Label className="text-white/60 uppercase tracking-widest text-[10px] font-bold">
              Cover Image <span className="text-red-500">*</span>
            </Label>
            {imagePreview ? (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 group">
                <Image
                  src={imagePreview.dataUrl}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                <div className="absolute bottom-2 left-2 text-white/60 text-xs bg-black/60 px-2 py-0.5 rounded">
                  {imagePreview.width} × {imagePreview.height}
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                  flex flex-col items-center justify-center aspect-video w-full rounded-lg border-2 border-dashed cursor-pointer transition-colors
                  ${isDragging ? "border-red-500 bg-red-500/5" : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"}
                `}
              >
                <Upload className="w-8 h-8 text-white/30 mb-2" />
                <p className="text-white/50 text-sm font-medium">Drop image here or click to browse</p>
                <p className="text-white/25 text-xs mt-1">JPG, PNG, WEBP</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* City & Country Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/60 uppercase tracking-widest text-[10px] font-bold">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Tokyo"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-red-500 focus-visible:border-red-500/50 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 uppercase tracking-widest text-[10px] font-bold">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Japan"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-red-500 focus-visible:border-red-500/50 rounded-lg"
              />
            </div>
          </div>

          {/* Country Code */}
          <div className="space-y-2">
            <Label className="text-white/60 uppercase tracking-widest text-[10px] font-bold">
              Country Code <span className="text-red-500">*</span>
            </Label>
            <Input
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              placeholder="JP"
              maxLength={4}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-red-500 focus-visible:border-red-500/50 rounded-lg w-24"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-white/60 uppercase tracking-widest text-[10px] font-bold">
              Description <span className="text-white/25">(optional)</span>
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A few words about this destination..."
              rows={3}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus-visible:ring-red-500 focus-visible:border-red-500/50 rounded-lg resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !imagePreview || !city || !country || !countryCode}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-wide rounded-lg disabled:opacity-40"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Album
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
