import { InferSelectModel, relations, sql } from "drizzle-orm";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  real,
  varchar,
  integer,
  uuid,
  uniqueIndex,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

// ⌚️ Reusable timestamps - Define once, use everywhere!
export const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
};

/***************
 ****************
 *  User Table  *
 ****************
 ***************/

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

/***************
 ****************
 *  Photo Table *
 ****************
 ***************/

export const photoVisibility = pgEnum("photo_visibility", [
  "public",
  "private",
]);

export const photos = pgTable(
  "photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    isFavorite: boolean("is_favorite").default(false).notNull(),
    visibility: photoVisibility("visibility").default("private").notNull(),
    aspectRatio: real("aspect_ratio").notNull(),
    width: real("width").notNull(),
    height: real("height").notNull(),
    blurData: text("blur_data").notNull(),

    country: text("country"),
    countryCode: text("country_code"),
    region: text("region"),
    city: text("city"),
    district: text("district"),

    fullAddress: text("full_address"),
    placeFormatted: text("place_formatted"),

    make: varchar("make", { length: 255 }),
    model: varchar("model", { length: 255 }),
    lensModel: varchar("lens_model", { length: 255 }),
    // focalLength: real("focal_length"),
    // focalLength35mm: real("focal_length_35mm"),
    // fNumber: real("f_number"),
    // iso: integer("iso"),
    // exposureTime: real("exposure_time"),
    exposureCompensation: real("exposure_compensation"),
    latitude: real("latitude"),
    longitude: real("longitude"),
    gpsAltitude: real("gps_altitude"),
    dateTimeOriginal: timestamp("datetime_original"),

    ...timestamps,
  },
  (t) => [
    index("year_idx").on(sql`DATE_TRUNC('year', ${t.dateTimeOriginal})`),
    index("city_idx").on(t.city),
  ]
);

export const citySets = pgTable(
  "city_sets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    description: text("description"),

    // GEO DATA
    country: text("country").notNull(),
    countryCode: text("country_code").notNull(),
    city: text("city").notNull(),

    // COVER PHOTO
    coverPhotoId: uuid("cover_photo_id")
      .references(() => photos.id)
      .notNull(),

    photoCount: integer("photo_count").default(0).notNull(),

    // META DATA
    ...timestamps,
  },
  (t) => [uniqueIndex("unique_city_set").on(t.country, t.city)]
);

// Soft relations
export const citySetsRelations = relations(citySets, ({ one, many }) => ({
  coverPhoto: one(photos, {
    fields: [citySets.coverPhotoId],
    references: [photos.id],
  }),
  photos: many(photos),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  citySet: one(citySets, {
    fields: [photos.country, photos.city],
    references: [citySets.country, citySets.city],
  }),
}));

// Schema
export const photosInsertSchema = createInsertSchema(photos).extend({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});
export const photosSelectSchema = createSelectSchema(photos);
export const photosUpdateSchema = createUpdateSchema(photos)
  .pick({
    id: true,
    title: true,
    description: true,
    isFavorite: true,
    latitude: true,
    longitude: true,
    visibility: true,
  })
  .partial();

// Types
export type Photo = InferSelectModel<typeof photos>;
export type CitySet = InferSelectModel<typeof citySets>;
// with photos & cover photo
export type CitySetWithPhotos = CitySet & { photos: Photo[] } & {
  coverPhoto: Photo;
};

/***************
 ****************
 *  Post Table  *
 ****************
 ***************/

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
});

export const postVisibility = pgEnum("post_visibility", ["public", "private"]);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    categoryId: uuid("category_id").references(() => categories.id),
    visibility: postVisibility("visibility").default("private").notNull(),
    tags: text("tags").array(),
    coverImage: text("cover_image"),
    description: text("description"),
    content: text("content"),
    readingTimeMinutes: integer("reading_time_minutes"),

    ...timestamps,
  },
  (t) => [
    index("category_idx").on(t.categoryId),
    index("tags_idx").on(t.tags),
    index("slug_idx").on(t.slug),
  ]
);

// Types
export type Post = InferSelectModel<typeof posts>;

// Schema
export const postsInsertSchema = createInsertSchema(posts);
export const postsSelectSchema = createSelectSchema(posts);
export const postsUpdateSchema = createUpdateSchema(posts);

/***************
 ****************
 *  Trip Table  *
 ****************
 ***************/

// ── Enums ────────────────────────────────────────────────────────────────────

export const tripStatus = pgEnum("trip_status", [
  "draft",
  "published",
  "archived",
]);

export const tripDifficulty = pgEnum("trip_difficulty", [
  "easy",
  "moderate",
  "adventurous",
]);

export const enrollmentStatus = pgEnum("enrollment_status", [
  "pending",
  "confirmed",
  "cancelled",
  "waitlisted",
]);

// ── trips ─────────────────────────────────────────────────────────────────────
// Core unit: one curated photography trip (e.g. 冰島：極光與孤島靈魂)
// Links to:  city_sets (travel destination), photos (cover image), posts (blog)

export const trips = pgTable(
  "trips",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Content
    title: text("title").notNull(),
    subtitle: text("subtitle").notNull(),
    description: text("description"),

    // Display
    coverPhotoId: uuid("cover_photo_id").references(() => photos.id),
    accentGradient: text("accent_gradient"), // e.g. "from-cyan-400/30 via-sky-500/10 to-transparent"

    // Geo — links to existing city_sets table
    citySetId: uuid("city_set_id").references(() => citySets.id),
    locationLabel: text("location_label").notNull(), // display string e.g. "冰島, 雷克雅未克"

    // Schedule
    durationDays: integer("duration_days").notNull(),
    bestSeasonLabel: text("best_season_label"), // e.g. "Jan - Mar"
    departureDateStart: timestamp("departure_date_start"),
    departureDateEnd: timestamp("departure_date_end"),

    // Pricing
    priceUsd: integer("price_usd").notNull(), // stored in cents: 880000 = $8,800

    // Capacity
    minGroupSize: integer("min_group_size").default(1),
    maxGroupSize: integer("max_group_size").default(10),

    // Linked blog post (trip story / itinerary)
    postId: uuid("post_id").references(() => posts.id),

    // Status
    status: tripStatus("status").default("draft").notNull(),
    difficulty: tripDifficulty("difficulty").default("moderate").notNull(),

    ...timestamps,
  },
  (t) => [
    index("trip_status_idx").on(t.status),
    index("trip_city_set_idx").on(t.citySetId),
    index("trip_departure_idx").on(t.departureDateStart),
  ]
);

// ── trip_tags ────────────────────────────────────────────────────────────────
// Short keyword badges shown on the card (e.g. "極光獵人", "深夜掃街")

export const tripTags = pgTable(
  "trip_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (t) => [index("trip_tags_trip_idx").on(t.tripId)]
);

// ── trip_features ─────────────────────────────────────────────────────────────
// Highlighted feature pills shown at the bottom of each card
// (e.g. "攝影指導", "小團互動", "野性探險")

export const tripFeatures = pgTable(
  "trip_features",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    // icon key maps to a lucide icon name on the frontend (camera | users | star | compass …)
    iconKey: varchar("icon_key", { length: 64 }),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (t) => [index("trip_features_trip_idx").on(t.tripId)]
);

// ── trip_gallery ──────────────────────────────────────────────────────────────
// Additional photos attached to a trip (the main cover is on trips.coverPhotoId)

export const tripGallery = pgTable(
  "trip_gallery",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    photoId: uuid("photo_id")
      .notNull()
      .references(() => photos.id, { onDelete: "cascade" }),
    caption: text("caption"),
    sortOrder: integer("sort_order").default(0).notNull(),
    ...timestamps,
  },
  (t) => [
    index("trip_gallery_trip_idx").on(t.tripId),
    uniqueIndex("trip_gallery_unique").on(t.tripId, t.photoId),
  ]
);

// ── trip_enrollments ──────────────────────────────────────────────────────────
// A user expressing interest in / booking a trip

export const tripEnrollments = pgTable(
  "trip_enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tripId: uuid("trip_id")
      .notNull()
      .references(() => trips.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: enrollmentStatus("status").default("pending").notNull(),
    note: text("note"), // optional message from the traveller
    ...timestamps,
  },
  (t) => [
    index("enrollment_trip_idx").on(t.tripId),
    index("enrollment_user_idx").on(t.userId),
    uniqueIndex("enrollment_unique").on(t.tripId, t.userId),
  ]
);

// ── Relations ─────────────────────────────────────────────────────────────────

export const tripsRelations = relations(trips, ({ one, many }) => ({
  coverPhoto: one(photos, {
    fields: [trips.coverPhotoId],
    references: [photos.id],
  }),
  citySet: one(citySets, {
    fields: [trips.citySetId],
    references: [citySets.id],
  }),
  post: one(posts, {
    fields: [trips.postId],
    references: [posts.id],
  }),
  tags: many(tripTags),
  features: many(tripFeatures),
  gallery: many(tripGallery),
  enrollments: many(tripEnrollments),
}));

export const tripTagsRelations = relations(tripTags, ({ one }) => ({
  trip: one(trips, { fields: [tripTags.tripId], references: [trips.id] }),
}));

export const tripFeaturesRelations = relations(tripFeatures, ({ one }) => ({
  trip: one(trips, { fields: [tripFeatures.tripId], references: [trips.id] }),
}));

export const tripGalleryRelations = relations(tripGallery, ({ one }) => ({
  trip: one(trips, { fields: [tripGallery.tripId], references: [trips.id] }),
  photo: one(photos, { fields: [tripGallery.photoId], references: [photos.id] }),
}));

export const tripEnrollmentsRelations = relations(tripEnrollments, ({ one }) => ({
  trip: one(trips, { fields: [tripEnrollments.tripId], references: [trips.id] }),
  user: one(user, { fields: [tripEnrollments.userId], references: [user.id] }),
}));

// ── Types ─────────────────────────────────────────────────────────────────────

export type Trip = InferSelectModel<typeof trips>;
export type TripTag = InferSelectModel<typeof tripTags>;
export type TripFeature = InferSelectModel<typeof tripFeatures>;
export type TripGalleryItem = InferSelectModel<typeof tripGallery>;
export type TripEnrollment = InferSelectModel<typeof tripEnrollments>;

export type TripFull = Trip & {
  coverPhoto: Photo | null;
  citySet: CitySet | null;
  post: Post | null;
  tags: TripTag[];
  features: TripFeature[];
  gallery: (TripGalleryItem & { photo: Photo })[];
  enrollments: TripEnrollment[];
};

// ── Zod Schemas ───────────────────────────────────────────────────────────────

export const tripsInsertSchema = createInsertSchema(trips).extend({
  title: z.string().min(1, { message: "Title is required" }),
  locationLabel: z.string().min(1, { message: "Location is required" }),
  durationDays: z.number().int().positive(),
  priceUsd: z.number().int().positive({ message: "Price must be a positive integer (cents)" }),
});
export const tripsSelectSchema = createSelectSchema(trips);
export const tripsUpdateSchema = createUpdateSchema(trips).partial();
