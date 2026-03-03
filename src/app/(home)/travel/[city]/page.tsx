import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { trpc } from "@/trpc/server";
import { getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { CityView } from "@/modules/travel/ui/views/city-view";

type Props = {
  params: Promise<{
    city: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = (await params).city;

  return {
    title: decodeURIComponent(city),
  };
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: Props) => {
  const { city } = await params;

  // Decode URL-encoded params
  const decodedCity = decodeURIComponent(city);

  const queryClient = getQueryClient();
  const cityData = await queryClient
    .fetchQuery(trpc.travel.getOne.queryOptions({ city: decodedCity }))
    .catch(() => null);

  if (!cityData) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<p>Something went wrong</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <CityView city={decodedCity} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default Page;
