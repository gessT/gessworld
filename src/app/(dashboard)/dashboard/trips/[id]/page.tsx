import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { trpc, getQueryClient } from "@/trpc/server";
import {
  EditTripView,
  ErrorStatus,
} from "@/modules/discover/ui/views/edit-trip-view";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.discover.getOne.queryOptions({ id }));
  void queryClient.prefetchQuery(trpc.city.getMany.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div className="p-8">Loading…</div>}>
        <ErrorBoundary fallback={<ErrorStatus />}>
          <EditTripView id={id} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;
