"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteToggleProps {
  photoId: string;
  initialValue: boolean;
}

export function FavoriteToggle({ photoId, initialValue }: FavoriteToggleProps) {
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Initialize state after hydration to prevent mismatch
  useEffect(() => {
    setIsFavorite(initialValue);
    setIsMounted(true);
  }, [initialValue]);

  const updatePhoto = useMutation(trpc.photos.update.mutationOptions());

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click if table has row click handler

    if (isFavorite === null) return;

    const newValue = !isFavorite;

    // Optimistic update
    setIsFavorite(newValue);

    updatePhoto.mutate(
      {
        id: photoId,
        isFavorite: newValue,
      },
      {
        onSuccess: async () => {
          // Invalidate queries to refetch photos list
          await queryClient.invalidateQueries(
            trpc.photos.getMany.queryOptions({})
          );
          toast.success(
            newValue ? "Added to favorites" : "Removed from favorites"
          );
        },
        onError: (error) => {
          // Revert on error
          setIsFavorite(!newValue);
          toast.error(error.message || "Failed to update favorite status");
        },
      }
    );
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted || isFavorite === null) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="h-8 w-8 bg-muted rounded animate-pulse"
      />
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={updatePhoto.isPending}
      className={cn(
        "h-8 w-8 transition-colors",
        isFavorite && "text-red-500 hover:text-red-600"
      )}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn("size-6 transition-all", isFavorite && "fill-current")}
      />
    </Button>
  );
}
