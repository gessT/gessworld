import { z } from "zod";
import { db } from "@/db";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { count, desc, eq, ilike, isNotNull, and, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  photos,
  trips,
  tripTags,
  tripFeatures,
} from "@/db/schema";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import { tripFormSchema, tripUpdateFormSchema } from "../schemas";

// Lucide icon keys assigned by feature position (cycles if > 3 features)
const FEATURE_ICON_KEYS = ["camera", "users", "star", "compass", "map-pin"];

export const discoverRouter = createTRPCRouter({
  // ── Public ───────────────────────────────────────────────────────────────

  getManyPhotos: baseProcedure.input(z.object({})).query(async () => {
    const data = await db
      .select({
        id: photos.id,
        url: photos.url,
        title: photos.title,
        latitude: photos.latitude,
        longitude: photos.longitude,
        blurData: photos.blurData,
        width: photos.width,
        height: photos.height,
        dateTimeOriginal: photos.dateTimeOriginal,
      })
      .from(photos)
      .where(
        and(
          eq(photos.visibility, "public"),
          isNotNull(photos.latitude),
          isNotNull(photos.longitude)
        )
      )
      .orderBy(desc(photos.updatedAt));

    return data;
  }),

  getManyTrips: baseProcedure.query(async () => {
    const data = await db
      .select()
      .from(trips)
      .where(eq(trips.status, "published"))
      .orderBy(desc(trips.createdAt));

    if (data.length === 0) return [];

    // Fetch tags and features for all trips in two queries
    const tripIds = data.map((t) => t.id);

    const allTags = await db
      .select()
      .from(tripTags)
      .where(
        tripIds.length === 1
          ? eq(tripTags.tripId, tripIds[0])
          : inArray(tripTags.tripId, tripIds)
      )
      .orderBy(tripTags.sortOrder);

    const allFeatures = await db
      .select()
      .from(tripFeatures)
      .where(
        tripIds.length === 1
          ? eq(tripFeatures.tripId, tripIds[0])
          : inArray(tripFeatures.tripId, tripIds)
      )
      .orderBy(tripFeatures.sortOrder);

    // Attach cover photo URL
    const coverIds = data
      .map((t) => t.coverPhotoId)
      .filter((id): id is string => id !== null);

    const coverPhotos =
      coverIds.length > 0
        ? await db
            .select({ id: photos.id, url: photos.url, blurData: photos.blurData })
            .from(photos)
            .where(
              coverIds.length === 1
                ? eq(photos.id, coverIds[0])
                : inArray(photos.id, coverIds)
            )
        : [];

    return data.map((trip) => ({
      ...trip,
      tags: allTags
        .filter((t) => t.tripId === trip.id)
        .map((t) => t.label),
      features: allFeatures
        .filter((f) => f.tripId === trip.id)
        .map((f) => ({ label: f.label, iconKey: f.iconKey })),
      coverPhoto:
        coverPhotos.find((p) => p.id === trip.coverPhotoId) ?? null,
    }));
  }),

  // ── Protected (Dashboard) ────────────────────────────────────────────────

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search } = input;

      const data = await db
        .select()
        .from(trips)
        .where(search ? ilike(trips.title, `%${search}%`) : undefined)
        .orderBy(desc(trips.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(trips)
        .where(search ? ilike(trips.title, `%${search}%`) : undefined);

      return {
        items: data,
        total: total.count,
        totalPages: Math.ceil(total.count / pageSize),
      };
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [trip] = await db
        .select()
        .from(trips)
        .where(eq(trips.id, input.id));

      if (!trip) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
      }

      const tags = await db
        .select()
        .from(tripTags)
        .where(eq(tripTags.tripId, trip.id))
        .orderBy(tripTags.sortOrder);

      const features = await db
        .select()
        .from(tripFeatures)
        .where(eq(tripFeatures.tripId, trip.id))
        .orderBy(tripFeatures.sortOrder);

      return {
        ...trip,
        tags: tags.map((t) => t.label),
        features: features.map((f) => f.label),
      };
    }),

  create: protectedProcedure
    .input(tripFormSchema)
    .mutation(async ({ input }) => {
      const { tags, features, priceUsd, ...tripData } = input;

      const [newTrip] = await db
        .insert(trips)
        .values({ ...tripData, priceUsd: priceUsd * 100 })
        .returning();

      if (tags.length > 0) {
        await db.insert(tripTags).values(
          tags.map((label, i) => ({
            tripId: newTrip.id,
            label,
            sortOrder: i,
          }))
        );
      }

      if (features.length > 0) {
        await db.insert(tripFeatures).values(
          features.map((label, i) => ({
            tripId: newTrip.id,
            label,
            iconKey: FEATURE_ICON_KEYS[i % FEATURE_ICON_KEYS.length],
            sortOrder: i,
          }))
        );
      }

      return newTrip;
    }),

  update: protectedProcedure
    .input(tripUpdateFormSchema)
    .mutation(async ({ input }) => {
      const { id, tags, features, priceUsd, ...tripData } = input;

      const [updatedTrip] = await db
        .update(trips)
        .set({ ...tripData, priceUsd: priceUsd * 100, updatedAt: new Date() })
        .where(eq(trips.id, id))
        .returning();

      if (!updatedTrip) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
      }

      // Replace tags
      await db.delete(tripTags).where(eq(tripTags.tripId, id));
      if (tags.length > 0) {
        await db.insert(tripTags).values(
          tags.map((label, i) => ({
            tripId: id,
            label,
            sortOrder: i,
          }))
        );
      }

      // Replace features
      await db.delete(tripFeatures).where(eq(tripFeatures.tripId, id));
      if (features.length > 0) {
        await db.insert(tripFeatures).values(
          features.map((label, i) => ({
            tripId: id,
            label,
            iconKey: FEATURE_ICON_KEYS[i % FEATURE_ICON_KEYS.length],
            sortOrder: i,
          }))
        );
      }

      return updatedTrip;
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const [deleted] = await db
        .delete(trips)
        .where(eq(trips.id, input.id))
        .returning();

      if (!deleted) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
      }

      return deleted;
    }),
});
