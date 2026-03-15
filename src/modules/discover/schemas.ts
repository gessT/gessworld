import { z } from "zod";

export const tripFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  subtitle: z.string().min(1, { message: "Subtitle is required" }),
  description: z.string().optional(),
  locationLabel: z.string().min(1, { message: "Location is required" }),
  durationDays: z
    .number()
    .int()
    .positive({ message: "Duration must be at least 1 day" }),
  priceUsd: z
    .number()
    .int()
    .positive({ message: "Price is required (enter full dollars, e.g. 8800)" }),
  bestSeasonLabel: z.string().optional(),
  minGroupSize: z.number().int().min(1).optional(),
  maxGroupSize: z.number().int().min(1).optional(),
  accentGradient: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  difficulty: z.enum(["easy", "moderate", "adventurous"]).default("moderate"),
  tags: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
});

export const tripUpdateFormSchema = tripFormSchema.extend({
  id: z.string().min(1),
});

export type TripFormValues = z.infer<typeof tripFormSchema>;
export type TripUpdateFormValues = z.infer<typeof tripUpdateFormSchema>;
