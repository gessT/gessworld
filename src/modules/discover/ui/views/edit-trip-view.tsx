"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TripForm } from "../components/trip-form";

export const EditTripView = ({ id }: { id: string }) => {
  const trpc = useTRPC();
  const { data: trip } = useSuspenseQuery(
    trpc.discover.getOne.queryOptions({ id })
  );

  return (
    <div className="px-4 md:px-8 py-4 md:py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Edit Trip</h2>
        <p className="text-muted-foreground text-sm">{trip.title}</p>
      </div>
      <TripForm trip={trip} />
    </div>
  );
};

export const ErrorStatus = () => <div>Something went wrong</div>;
