import { z } from "zod";
import { db } from "@/db";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { citySets, photos } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/modules/s3/lib/server-client";

export const cityRouter = createTRPCRouter({
  // Get all city sets
  getMany: baseProcedure.query(async () => {
    const data = await db
      .select({
        id: citySets.id,
        country: citySets.country,
        countryCode: citySets.countryCode,
        city: citySets.city,
        description: citySets.description,
        photoCount: citySets.photoCount,
        coverPhotoId: citySets.coverPhotoId,
        createdAt: citySets.createdAt,
        updatedAt: citySets.updatedAt,
        // Join with cover photo
        coverPhotoUrl: photos.url,
        coverPhotoBlurData: photos.blurData,
        coverPhotoTitle: photos.title,
      })
      .from(citySets)
      .innerJoin(photos, eq(citySets.coverPhotoId, photos.id))
      .orderBy(desc(citySets.updatedAt), desc(citySets.createdAt));

    return data;
  }),

  // Get one city set with all photos
  getOne: baseProcedure
    .input(
      z.object({
        city: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { city } = input;

      // Get city set info
      const [citySet] = await db
        .select()
        .from(citySets)
        .where(and(eq(citySets.city, city)));

      if (!citySet) {
        return null;
      }

      // Get all photos in this city
      const cityPhotos = await db
        .select()
        .from(photos)
        .where(and(eq(photos.city, city)))
        .orderBy(desc(photos.dateTimeOriginal), desc(photos.createdAt));

      return {
        ...citySet,
        photos: cityPhotos,
      };
    }),

  // Update city cover photo
  updateCoverPhoto: protectedProcedure
    .input(
      z.object({
        cityId: z.uuid(),
        photoId: z.uuid(),
      })
    )
    .mutation(async ({ input }) => {
      const { cityId, photoId } = input;

      // Verify the photo exists
      const [photo] = await db
        .select()
        .from(photos)
        .where(eq(photos.id, photoId));

      if (!photo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Photo not found",
        });
      }

      // Verify the city set exists
      const [citySet] = await db
        .select()
        .from(citySets)
        .where(eq(citySets.id, cityId));

      if (!citySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "City not found",
        });
      }

      // Verify the photo belongs to this city
      if (photo.city !== citySet.city) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Photo does not belong to this city",
        });
      }

      // Update the cover photo
      const [updatedCitySet] = await db
        .update(citySets)
        .set({
          coverPhotoId: photoId,
          updatedAt: new Date(),
        })
        .where(eq(citySets.id, cityId))
        .returning();

      return updatedCitySet;
    }),

  // Update city description
  updateDescription: protectedProcedure
    .input(
      z.object({
        cityId: z.uuid(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { cityId, description } = input;

      // Verify the city set exists
      const [citySet] = await db
        .select()
        .from(citySets)
        .where(eq(citySets.id, cityId));

      if (!citySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "City not found",
        });
      }

      // Update the description
      const [updatedCitySet] = await db
        .update(citySets)
        .set({
          description,
          updatedAt: new Date(),
        })
        .where(eq(citySets.id, cityId))
        .returning();

      return updatedCitySet;
    }),

  // Create a new city album with a cover image
  create: protectedProcedure
    .input(
      z.object({
        city: z.string().min(1),
        country: z.string().min(1),
        countryCode: z.string().min(1).max(4),
        description: z.string().optional(),
        coverImageBase64: z.string().min(1),
        coverImageType: z.string().min(1),
        coverImageName: z.string().min(1),
        coverImageWidth: z.number().optional(),
        coverImageHeight: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        city,
        country,
        countryCode,
        description,
        coverImageBase64,
        coverImageType,
        coverImageName,
        coverImageWidth,
        coverImageHeight,
      } = input;

      // Strip data URL prefix if present
      const base64Data = coverImageBase64.includes(",")
        ? coverImageBase64.split(",")[1]!
        : coverImageBase64;

      const buffer = Buffer.from(base64Data, "base64");
      const uuid = crypto.randomUUID();
      const key = `cities/${uuid}-${coverImageName}`;

      // Upload cover image to S3
      try {
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: coverImageType,
          ContentLength: buffer.length,
        });
        await s3Client.send(command);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to upload cover image",
        });
      }

      const width = coverImageWidth ?? 1200;
      const height = coverImageHeight ?? 800;
      const aspectRatio = width / height;

      // Insert photo record
      const [newPhoto] = await db
        .insert(photos)
        .values({
          url: key,
          title: city,
          description: "",
          visibility: "public",
          aspectRatio,
          width,
          height,
          blurData: "",
          city,
          country,
          countryCode,
        })
        .returning();

      if (!newPhoto) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create photo record",
        });
      }

      // Insert city set
      const [newCitySet] = await db
        .insert(citySets)
        .values({
          city,
          country,
          countryCode,
          description: description ?? null,
          coverPhotoId: newPhoto.id,
        })
        .returning();

      if (!newCitySet) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create city album",
        });
      }

      return newCitySet;
    }),

  // Delete a city album (and its cover photo record + S3 object)
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      const { id } = input;

      const [citySet] = await db
        .select()
        .from(citySets)
        .where(eq(citySets.id, id));

      if (!citySet) {
        throw new TRPCError({ code: "NOT_FOUND", message: "City not found" });
      }

      // Get the cover photo's S3 key before deletion
      const [coverPhoto] = await db
        .select({ url: photos.url })
        .from(photos)
        .where(eq(photos.id, citySet.coverPhotoId));

      // Delete the city set
      await db.delete(citySets).where(eq(citySets.id, id));

      // Delete the cover photo record
      await db.delete(photos).where(eq(photos.id, citySet.coverPhotoId));

      // Try to delete the S3 object (non-fatal)
      if (coverPhoto?.url) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME,
              Key: coverPhoto.url,
            })
          );
        } catch {
          // ignore S3 cleanup errors
        }
      }

      return { id };
    }),
});
