import { inferRouterOutputs } from "@trpc/server";
import type { appRouter } from "@/trpc/routers/_app";

type RouterOutput = inferRouterOutputs<typeof appRouter>;

export type DiscoverGetManyPhotos =
  RouterOutput["discover"]["getManyPhotos"];

export type TripGetOne = RouterOutput["discover"]["getOne"];

export type TripGetMany =
  RouterOutput["discover"]["getMany"]["items"];
