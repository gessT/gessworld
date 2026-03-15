"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "@/hooks/use-confirm";

interface DeleteTripButtonProps {
  tripId: string;
  tripTitle: string;
}

export function DeleteTripButton({ tripId, tripTitle }: DeleteTripButtonProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Trip",
    `Are you sure you want to delete "${tripTitle}"? This action cannot be undone.`
  );

  const deleteTrip = useMutation(
    trpc.discover.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.discover.getMany.queryOptions({})
        );
        toast.success("Trip deleted successfully");
      },
      onError: (e) => {
        toast.error("Failed to delete trip", { description: e.message });
      },
    })
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    deleteTrip.mutate({ id: tripId });
  };

  return (
    <>
      <ConfirmDialog />
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={deleteTrip.isPending}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </>
  );
}
