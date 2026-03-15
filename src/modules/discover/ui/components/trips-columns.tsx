"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TripGetMany } from "../../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PenBoxIcon } from "lucide-react";
import Link from "next/link";
import { DeleteTripButton } from "./delete-trip-button";

export const columns: ColumnDef<TripGetMany[number]>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <p className="font-medium truncate">{row.original.title}</p>
        <p className="text-xs text-muted-foreground truncate">
          {row.original.locationLabel}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "durationDays",
    header: "Duration",
    cell: ({ row }) => `${row.original.durationDays} days`,
  },
  {
    accessorKey: "priceUsd",
    header: "Price",
    cell: ({ row }) => {
      const dollars = row.original.priceUsd / 100;
      return `$${dollars.toLocaleString()}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={
            status === "published"
              ? "default"
              : status === "draft"
                ? "secondary"
                : "outline"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => (
      <span className="capitalize text-sm text-muted-foreground">
        {row.original.difficulty}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <DeleteTripButton
          tripId={row.original.id}
          tripTitle={row.original.title}
        />
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/trips/${row.original.id}`}>
            <PenBoxIcon className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    ),
  },
];
