import { z } from "zod";
import { db } from "@/db";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { and, eq, desc, asc, sql, ilike, count } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constants";
import {
  citySets,
  photos,
  photosUpdateSchema,
  photosInsertSchema,
} from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/modules/s3/lib/server-client";

export const photosRouter = createTRPCRouter({
  create: protectedProcedure
    .input(photosInsertSchema)
    .mutation(async ({ input }) => {
      const values = input;

      try {
        const [insertedPhoto] = await db
          .insert(photos)
          .values(values)
          .returning();

        const cityName =
          values.countryCode === "JP" || values.countryCode === "TW"
            ? values.region
            : values.city;

        if (insertedPhoto.country && cityName && insertedPhoto.countryCode) {
          await db
            .insert(citySets)
            .values({
              country: insertedPhoto.country,
              countryCode: insertedPhoto.countryCode,
              city: cityName,
              photoCount: 1,
              coverPhotoId: insertedPhoto.id,
            })
            .onConflictDoUpdate({
              target: [citySets.country, citySets.city],
              set: {
                countryCode: insertedPhoto.countryCode,
                photoCount: sql`${citySets.photoCount} + 1`,
                coverPhotoId: sql`COALESCE(${citySets.coverPhotoId}, ${insertedPhoto.id})`,
                updatedAt: new Date(),
              },
            });

          await db
            .select()
            .from(citySets)
            .where(
              sql`${citySets.country} = ${insertedPhoto.country} AND ${citySets.city} = ${insertedPhoto.city}`
            );
        } else {
        }

        return insertedPhoto;
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create photo",
        });
      }
    }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      if (!id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      try {
        const [photo] = await db.select().from(photos).where(eq(photos.id, id));

        if (!photo) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Photo not found",
          });
        }

        // ── Step 1: Resolve any citySet that uses this photo as its cover ──
        // Must do this BEFORE deleting the photo row to avoid FK violation.
        const coverCitySets = await db
          .select()
          .from(citySets)
          .where(eq(citySets.coverPhotoId, id));

        for (const citySet of coverCitySets) {
          if (citySet.photoCount <= 1) {
            // Only photo in the set — delete the entire set
            await db.delete(citySets).where(eq(citySets.id, citySet.id));
          } else {
            // Find a replacement cover photo from the same city
            const [newCover] = await db
              .select()
              .from(photos)
              .where(
                and(
                  eq(photos.country, citySet.country),
                  eq(photos.city, citySet.city),
                  sql`${photos.id} != ${id}`
                )
              )
              .limit(1);

            await db
              .update(citySets)
              .set({
                coverPhotoId: newCover?.id ?? citySet.coverPhotoId, // keep old only if no replacement (shouldn't happen)
                photoCount: sql`${citySets.photoCount} - 1`,
                updatedAt: new Date(),
              })
              .where(eq(citySets.id, citySet.id));
          }
        }

        // ── Step 2: Decrement count on city sets linked by country/city (non-cover photos) ──
        if (photo.country && photo.city) {
          await db
            .update(citySets)
            .set({
              photoCount: sql`${citySets.photoCount} - 1`,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(citySets.country, photo.country),
                eq(citySets.city, photo.city),
                sql`${citySets.coverPhotoId} != ${id}` // cover already handled above
              )
            );
        }

        // ── Step 3: Delete photo DB record (FK is now clear) ──
        await db.delete(photos).where(eq(photos.id, id));

        // Attempt S3 deletion — extract key from URL if needed, don't block on failure
        try {
          const rawUrl = photo.url;
          const key = rawUrl.startsWith("http")
            ? new URL(rawUrl).pathname.replace(/^\//, "")
            : rawUrl;

          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME,
              Key: key,
            })
          );
        } catch (s3Err) {
          // S3 cleanup failed — log but don't fail the request (DB record is already gone)
          console.error("S3 delete failed (non-fatal):", s3Err);
        }

        return photo;
      } catch (error) {
        // Re-throw TRPCErrors as-is so callers get correct status codes
        if (error instanceof TRPCError) throw error;
        console.error("Photo deletion error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to delete photo",
        });
      }
    }),
  update: protectedProcedure
    .input(photosUpdateSchema)
    .mutation(async ({ input }) => {
      const { id } = input;

      if (!id) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [updatedPhoto] = await db
        .update(photos)
        .set({
          ...input,
        })
        .where(eq(photos.id, id))
        .returning();

      if (!updatedPhoto) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return updatedPhoto;
    }),
  getOne: baseProcedure
    .input(
      z.object({
        id: z.uuid(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;

      const [photo] = await db.select().from(photos).where(eq(photos.id, id));

      return photo;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        orderBy: z.enum(["asc", "desc"] as const).default("desc"),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const { page, pageSize, search, orderBy } = input;

      const data = await db
        .select()
        .from(photos)
        .where(search ? ilike(photos.title, `%${search}%`) : undefined)
        .orderBy(
          orderBy === "asc"
            ? asc(photos.dateTimeOriginal)
            : desc(photos.dateTimeOriginal)
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({
          count: count(),
        })
        .from(photos)
        .where(search ? ilike(photos.title, `%${search}%`) : undefined);

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),
});
