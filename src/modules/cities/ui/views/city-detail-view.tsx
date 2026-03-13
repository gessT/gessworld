"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import {
  ArrowLeft,
  MapPin,
  Image as ImageIcon,
  Star,
  StarOff,
  Upload,
  X,
  Camera,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FramedPhoto } from "@/components/framed-photo";
import BlurImage from "@/components/blur-image";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

const cityDescriptionSchema = z.object({
  description: z.string().optional(),
});

type CityDescriptionForm = z.infer<typeof cityDescriptionSchema>;

interface CityDetailViewProps {
  city: string;
}

interface CoverImagePreview {
  dataUrl: string;
  base64: string;
  type: string;
  name: string;
  width: number;
  height: number;
}

export function CityDetailView({ city }: CityDetailViewProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: cityData } = useSuspenseQuery(
    trpc.city.getOne.queryOptions({ city })
  );

  const [coverDialogOpen, setCoverDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [coverPreview, setCoverPreview] = useState<CoverImagePreview | null>(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch photos directly from photos table filtered by city or region
  const { data: albumPhotos = [] } = useQuery(
    trpc.photos.getByCity.queryOptions({
      city: cityData?.city ?? undefined,
    })
  );

  const form = useForm<CityDescriptionForm>({
    resolver: zodResolver(cityDescriptionSchema),
    defaultValues: {
      description: "",
    },
  });

  const updateCoverPhoto = useMutation(
    trpc.city.updateCoverPhoto.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.city.getOne.queryOptions({ city }));
        await queryClient.invalidateQueries(trpc.city.getMany.queryOptions());
        toast.success("Cover photo updated");
        setCoverDialogOpen(false);
        setSelectedPhotoId(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update cover photo");
      },
    })
  );

  const updateCoverImage = useMutation(
    trpc.city.updateCoverImage.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.city.getOne.queryOptions({ city }));
        await queryClient.invalidateQueries(trpc.city.getMany.queryOptions());
        toast.success("Cover image updated");
        setCoverDialogOpen(false);
        setCoverPreview(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update cover image");
      },
    })
  );

  const processCoverFile = useCallback((file: File) => {
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
        setCoverPreview({ dataUrl, base64, type: file.type, name: file.name, width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processCoverFile(file);
  };

  const handleCoverSubmit = () => {
    if (!coverPreview || !cityData) return;
    updateCoverImage.mutate({
      cityId: cityData.id,
      coverImageBase64: coverPreview.base64,
      coverImageType: coverPreview.type,
      coverImageName: coverPreview.name,
      coverImageWidth: coverPreview.width,
      coverImageHeight: coverPreview.height,
    });
  };

  const updateDescription = useMutation(
    trpc.city.updateDescription.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.city.getOne.queryOptions({ city })
        );
        await queryClient.invalidateQueries(trpc.city.getMany.queryOptions());
        await queryClient.invalidateQueries(
          trpc.home.getCitySets.queryOptions({ limit: 12 })
        );
        await queryClient.invalidateQueries(
          trpc.travel.getCitySets.queryOptions()
        );
        toast.success("Description updated successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update description");
      },
    })
  );

  useEffect(() => {
    if (cityData?.description !== undefined) {
      form.setValue("description", cityData.description || "");
    }
  }, [cityData?.description, form]);

  const handleSetCover = async (photoId: string) => {
    if (!cityData) return;
    updateCoverPhoto.mutate({ cityId: cityData.id, photoId });
  };

  if (!cityData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <MapPin className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">City not found</h3>
            <p className="text-muted-foreground text-sm">
              The city you&apos;re looking for doesn&apos;t exist or may have
              been removed.
            </p>
          </div>
          <Link href="/dashboard/cities">
            <Button variant="outline" className="min-w-[140px]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cities
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  console.log("cityData:", cityData);
  return (
    <div className="min-h-screen pb-8">
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link href="/dashboard/cities">
              <Button variant="ghost" className="mb-4 -ml-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Cities
              </Button>
            </Link>
          </div>
          {/* Cover Image Dialog */}
          <Dialog open={coverDialogOpen} onOpenChange={(open) => {
            setCoverDialogOpen(open);
            if (!open) { setCoverPreview(null); setSelectedPhotoId(null); }
          }}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Update Album Cover</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="album">
                <TabsList className="w-full">
                  <TabsTrigger value="album" className="flex-1">Pick from Album</TabsTrigger>
                  <TabsTrigger value="upload" className="flex-1">Upload New</TabsTrigger>
                </TabsList>

                {/* Tab 1: pick from existing album photos */}
                <TabsContent value="album" className="mt-3">
                  <p className="text-xs text-muted-foreground mb-3">Click a photo to select it as the album cover.</p>
                  <div className="h-[420px] overflow-y-auto">
                    <div className="grid grid-cols-3 gap-2 pr-1">
                      {albumPhotos.map((photo) => {
                        const isCurrent = photo.id === cityData.coverPhotoId;
                        const isSelected = photo.id === selectedPhotoId;
                        return (
                          <button
                            key={photo.id}
                            onClick={() => setSelectedPhotoId(photo.id)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              isSelected
                                ? "border-primary ring-2 ring-primary"
                                : isCurrent
                                ? "border-yellow-400"
                                : "border-transparent hover:border-muted-foreground/50"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={keyToUrl(photo.url)}
                              alt={photo.title}
                              className="w-full h-full object-cover"
                            />
                            {isCurrent && !isSelected && (
                              <div className="absolute top-1 right-1 bg-yellow-400 rounded-full p-0.5">
                                <Star className="h-3 w-3 text-yellow-900" />
                              </div>
                            )}
                            {isSelected && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <div className="bg-primary rounded-full p-1">
                                  <Star className="h-4 w-4 text-primary-foreground" />
                                </div>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                    <Button variant="outline" onClick={() => { setCoverDialogOpen(false); setSelectedPhotoId(null); }}>Cancel</Button>
                    <Button
                      onClick={() => { if (selectedPhotoId && cityData) updateCoverPhoto.mutate({ cityId: cityData.id, photoId: selectedPhotoId }); }}
                      disabled={!selectedPhotoId || updateCoverPhoto.isPending}
                    >
                      {updateCoverPhoto.isPending ? "Saving..." : "Set as Cover"}
                    </Button>
                  </div>
                </TabsContent>

                {/* Tab 2: upload a brand-new image */}
                <TabsContent value="upload" className="mt-3 space-y-4">
                  <p className="text-xs text-muted-foreground">Upload a new image — it will be stored in <code>photos/{cityData.city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/</code> on S3.</p>
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) processCoverFile(f); }}
                  />
                  {!coverPreview ? (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleCoverDrop}
                      onClick={() => coverFileInputRef.current?.click()}
                    >
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                      <p className="text-sm font-medium">Drop image here or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP supported</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative rounded-lg overflow-hidden aspect-video bg-muted">
                        <Image src={coverPreview.dataUrl} alt="Cover preview" fill className="object-cover" />
                        <button
                          onClick={() => setCoverPreview(null)}
                          className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:bg-background"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">{coverPreview.name} — {coverPreview.width}&times;{coverPreview.height}</p>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 pt-2 border-t">
                    <Button variant="outline" onClick={() => { setCoverDialogOpen(false); setCoverPreview(null); }}>Cancel</Button>
                    <Button onClick={handleCoverSubmit} disabled={!coverPreview || updateCoverImage.isPending}>
                      {updateCoverImage.isPending ? "Uploading..." : "Upload & Set Cover"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                  {cityData.city}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{cityData.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {cityData.photoCount} photos
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCoverDialogOpen(true)}>
                <Camera className="h-4 w-4 mr-2" />
                Update Cover
              </Button>
            </div>

            {/* Description Form Card */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((values) => {
                    updateDescription.mutate({
                      cityId: cityData.id,
                      description: values.description || "",
                    });
                  })}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          City Descriptionss
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Add a description for this city..."
                            className="min-h-[100px] resize-none"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={updateDescription.isPending}
                      className="min-w-[100px]"
                    >
                      {updateDescription.isPending
                        ? "Saving..."
                        : "Save Description"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
          {albumPhotos.map((photo) => (
            <div key={photo.id} className="space-y-2">
              <div className="relative group rounded-lg overflow-hidden aspect-square shadow-lg">
                <BlurImage
                  src={photo.url!}
                  alt={photo.title}
                  blurhash={photo.blurData!}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  fill
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleSetCover(photo.id)}
                  >
                    {photo.id === cityData.coverPhotoId ? (
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium truncate">{photo.title}</p>
                <p className="text-xs text-muted-foreground">
                  {photo.dateTimeOriginal
                    ? format(photo.dateTimeOriginal, "d MMM yyyy")
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CityDetailLoadingView() {
  return (
    <div className="space-y-6 px-4 md:px-8">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function CityDetailErrorView() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4 md:px-8">
      <p className="text-destructive mb-2">Failed to load city details</p>
      <Link href="/dashboard/cities">
        <Button variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cities
        </Button>
      </Link>
    </div>
  );
}
