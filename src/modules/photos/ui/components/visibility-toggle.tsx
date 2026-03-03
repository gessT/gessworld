"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface VisibilityToggleProps {
  photoId: string;
  initialValue: "public" | "private";
}

export function VisibilityToggle({
  photoId,
  initialValue,
}: VisibilityToggleProps) {
  const [visibility, setVisibility] = useState<"public" | "private" | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Initialize state after hydration to prevent mismatch
  useEffect(() => {
    setVisibility(initialValue);
    setIsMounted(true);
  }, [initialValue]);

  const updatePhoto = useMutation(trpc.photos.update.mutationOptions());

  const handleToggle = async (checked: boolean) => {
    const newValue = checked ? "public" : "private";

    // Optimistic update
    setVisibility(newValue);

    updatePhoto.mutate(
      {
        id: photoId,
        visibility: newValue,
      },
      {
        onSuccess: async () => {
          // Invalidate queries to refetch photos list
          await queryClient.invalidateQueries(
            trpc.photos.getMany.queryOptions({})
          );
          toast.success(
            `Photo is now ${newValue === "public" ? "public" : "private"}`
          );
        },
        onError: (error) => {
          // Revert on error
          setVisibility(newValue === "public" ? "private" : "public");
          toast.error(error.message || "Failed to update visibility");
        },
      }
    );
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted || visibility === null) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-muted rounded animate-pulse" />
        <div className="w-[44px] h-6 bg-muted rounded-full animate-pulse" />
        <div className="text-sm text-muted-foreground min-w-[50px] bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      {visibility === "public" ? (
        <Eye className="h-4 w-4 text-green-600" />
      ) : (
        <EyeOff className="h-4 w-4 text-muted-foreground" />
      )}
      <Switch
        checked={visibility === "public"}
        onCheckedChange={handleToggle}
        disabled={updatePhoto.isPending}
        aria-label="Toggle visibility"
      />
      <span className="text-sm text-muted-foreground min-w-[50px]">
        {visibility === "public" ? "Public" : "Private"}
      </span>
    </div>
  );
}
