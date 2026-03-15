"use client";

import Link from "next/link";
import { PlusIcon, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_PAGE } from "@/constants";
import { useTripsFilters } from "../../hooks/use-trips-filters";

export const TripsListHeader = () => {
  const [filters, setFilters] = useTripsFilters();

  const isFiltered = !!filters.search;

  return (
    <div className="py-4 px-4 md:px-8 flex flex-col gap-y-8">
      <div>
        <h1 className="text-2xl font-bold">Trips</h1>
        <p className="text-muted-foreground">
          Manage your curated photography trips
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search trips…"
            value={filters.search}
            onChange={(e) =>
              setFilters({ search: e.target.value, page: DEFAULT_PAGE })
            }
            className="w-64"
          />
          {isFiltered && (
            <Button
              onClick={() =>
                setFilters({ search: "", page: DEFAULT_PAGE })
              }
              variant="outline"
              size="sm"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <Button asChild>
          <Link href="/dashboard/trips/new">
            <PlusIcon className="h-4 w-4 mr-1" />
            New Trip
          </Link>
        </Button>
      </div>
    </div>
  );
};
