"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlurImage from "@/components/blur-image";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import type { CityGetMany } from "../../types";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

interface CityCardProps {
  citySet: CityGetMany[number];
}

export function CityCard({ citySet }: CityCardProps) {
  const { id, country, city, photoCount, coverPhotoUrl, coverPhotoBlurData } = citySet;
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate: deleteCity, isPending } = useMutation(
    trpc.city.delete.mutationOptions()
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirmOpen) {
      setConfirmOpen(true);
      return;
    }
    deleteCity(
      { id },
      {
        onSuccess: () => {
          toast.success(`${city} album deleted`);
          queryClient.invalidateQueries(trpc.city.getMany.queryOptions());
        },
        onError: (err) => {
          toast.error(err.message ?? "Failed to delete album");
          setConfirmOpen(false);
        },
      }
    );
  };

  const handleCardClick = () => {
    if (confirmOpen) {
      setConfirmOpen(false);
      return;
    }
    router.push(`/dashboard/cities/${encodeURIComponent(city)}`);
  };

  return (
    <div
      className="block group relative cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-[#141414]">
        {/* Background Image */}
        {coverPhotoUrl && (
          <BlurImage
            src={keyToUrl(coverPhotoUrl)}
            alt={`${city}, ${country}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            blurhash={coverPhotoBlurData ?? undefined}
          />
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Red left accent bar */}
        <div className="absolute left-0 top-6 bottom-6 w-0.5 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Delete button */}
        <div className="absolute top-2 right-2 z-10">
          {confirmOpen ? (
            <div className="flex gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmOpen(false); }}
                className="px-2 py-1 rounded-md bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider hover:bg-white/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-2 py-1 rounded-md bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-red-500 transition-colors flex items-center gap-1 disabled:opacity-60"
              >
                {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                Delete
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <Trash2 className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-0.5">
            {country}
          </p>
          <h3 className="text-white font-black uppercase tracking-tight text-base leading-none">
            {city}
          </h3>
          <div className="flex items-center gap-1 mt-2">
            <Camera className="w-3 h-3 text-white/40" />
            <span className="text-white/40 text-xs">{photoCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
