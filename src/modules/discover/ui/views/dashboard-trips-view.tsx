"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { DataPagination } from "@/components/data-pagination";
import { columns } from "../components/trips-columns";
import { useTripsFilters } from "../../hooks/use-trips-filters";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { IconMapOff } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const DashboardTripsView = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useTripsFilters();

  const { data } = useSuspenseQuery(
    trpc.discover.getMany.queryOptions({ ...filters })
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      {data.items.length === 0 ? (
        <EmptyStatus />
      ) : (
        <>
          <DataTable columns={columns} data={data.items} />
          <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setFilters({ page })}
          />
        </>
      )}
    </div>
  );
};

const EmptyStatus = () => (
  <Empty className="border border-dashed">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <IconMapOff />
      </EmptyMedia>
      <EmptyTitle>No trips found</EmptyTitle>
      <EmptyDescription>
        Create your first photography trip to get started.
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent />
  </Empty>
);

export const ErrorStatus = () => <div>Something went wrong</div>;

export const LoadingStatus = () => (
  <div className="px-4 md:px-8">
    <Table>
      <TableHeader>
        <TableRow>
          {["Title", "Duration", "Price", "Status", "Difficulty", "Actions"].map(
            (h) => (
              <TableHead key={h}>{h}</TableHead>
            )
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            {Array.from({ length: 6 }).map((_, j) => (
              <TableCell key={j}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
