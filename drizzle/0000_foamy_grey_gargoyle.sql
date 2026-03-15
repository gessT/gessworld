CREATE TYPE "public"."enrollment_status" AS ENUM('pending', 'confirmed', 'cancelled', 'waitlisted');--> statement-breakpoint
CREATE TYPE "public"."photo_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TYPE "public"."post_visibility" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TYPE "public"."trip_difficulty" AS ENUM('easy', 'moderate', 'adventurous');--> statement-breakpoint
CREATE TYPE "public"."trip_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "city_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"description" text,
	"country" text NOT NULL,
	"country_code" text NOT NULL,
	"city" text NOT NULL,
	"cover_photo_id" uuid NOT NULL,
	"photo_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"visibility" "photo_visibility" DEFAULT 'private' NOT NULL,
	"aspect_ratio" real NOT NULL,
	"width" real NOT NULL,
	"height" real NOT NULL,
	"blur_data" text NOT NULL,
	"country" text,
	"country_code" text,
	"region" text,
	"city" text,
	"district" text,
	"full_address" text,
	"place_formatted" text,
	"make" varchar(255),
	"model" varchar(255),
	"lens_model" varchar(255),
	"exposure_compensation" real,
	"latitude" real,
	"longitude" real,
	"gps_altitude" real,
	"datetime_original" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"category_id" uuid,
	"visibility" "post_visibility" DEFAULT 'private' NOT NULL,
	"tags" text[],
	"cover_image" text,
	"description" text,
	"content" text,
	"reading_time_minutes" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "trip_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"status" "enrollment_status" DEFAULT 'pending' NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trip_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"label" text NOT NULL,
	"icon_key" varchar(64),
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trip_gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"photo_id" uuid NOT NULL,
	"caption" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trip_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trip_id" uuid NOT NULL,
	"label" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"description" text,
	"cover_photo_id" uuid,
	"accent_gradient" text,
	"city_set_id" uuid,
	"location_label" text NOT NULL,
	"duration_days" integer NOT NULL,
	"best_season_label" text,
	"departure_date_start" timestamp,
	"departure_date_end" timestamp,
	"price_usd" integer NOT NULL,
	"min_group_size" integer DEFAULT 1,
	"max_group_size" integer DEFAULT 10,
	"post_id" uuid,
	"status" "trip_status" DEFAULT 'draft' NOT NULL,
	"difficulty" "trip_difficulty" DEFAULT 'moderate' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "city_sets" ADD CONSTRAINT "city_sets_cover_photo_id_photos_id_fk" FOREIGN KEY ("cover_photo_id") REFERENCES "public"."photos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_enrollments" ADD CONSTRAINT "trip_enrollments_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_enrollments" ADD CONSTRAINT "trip_enrollments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_features" ADD CONSTRAINT "trip_features_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_gallery" ADD CONSTRAINT "trip_gallery_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_gallery" ADD CONSTRAINT "trip_gallery_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trip_tags" ADD CONSTRAINT "trip_tags_trip_id_trips_id_fk" FOREIGN KEY ("trip_id") REFERENCES "public"."trips"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_cover_photo_id_photos_id_fk" FOREIGN KEY ("cover_photo_id") REFERENCES "public"."photos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_city_set_id_city_sets_id_fk" FOREIGN KEY ("city_set_id") REFERENCES "public"."city_sets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trips" ADD CONSTRAINT "trips_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_city_set" ON "city_sets" USING btree ("country","city");--> statement-breakpoint
CREATE INDEX "year_idx" ON "photos" USING btree (DATE_TRUNC('year', "datetime_original"));--> statement-breakpoint
CREATE INDEX "city_idx" ON "photos" USING btree ("city");--> statement-breakpoint
CREATE INDEX "category_idx" ON "posts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "tags_idx" ON "posts" USING btree ("tags");--> statement-breakpoint
CREATE INDEX "slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "enrollment_trip_idx" ON "trip_enrollments" USING btree ("trip_id");--> statement-breakpoint
CREATE INDEX "enrollment_user_idx" ON "trip_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "enrollment_unique" ON "trip_enrollments" USING btree ("trip_id","user_id");--> statement-breakpoint
CREATE INDEX "trip_features_trip_idx" ON "trip_features" USING btree ("trip_id");--> statement-breakpoint
CREATE INDEX "trip_gallery_trip_idx" ON "trip_gallery" USING btree ("trip_id");--> statement-breakpoint
CREATE UNIQUE INDEX "trip_gallery_unique" ON "trip_gallery" USING btree ("trip_id","photo_id");--> statement-breakpoint
CREATE INDEX "trip_tags_trip_idx" ON "trip_tags" USING btree ("trip_id");--> statement-breakpoint
CREATE INDEX "trip_status_idx" ON "trips" USING btree ("status");--> statement-breakpoint
CREATE INDEX "trip_city_set_idx" ON "trips" USING btree ("city_set_id");--> statement-breakpoint
CREATE INDEX "trip_departure_idx" ON "trips" USING btree ("departure_date_start");