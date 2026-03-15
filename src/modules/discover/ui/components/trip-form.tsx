"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver } from "react-hook-form";
import { z } from "zod";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { tripFormSchema, tripUpdateFormSchema } from "../../schemas";
import { TripGetOne } from "../../types";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/modules/posts/ui/components/tags-input";
import { Separator } from "@/components/ui/separator";

type CreateFormValues = z.infer<typeof tripFormSchema>;
type UpdateFormValues = z.infer<typeof tripUpdateFormSchema>;

interface TripFormProps {
  trip?: TripGetOne;
}

export const TripForm = ({ trip }: TripFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const isEditing = !!trip;

  const createTrip = useMutation(
    trpc.discover.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Trip created successfully");
        await queryClient.invalidateQueries(
          trpc.discover.getMany.queryOptions({})
        );
        router.push("/dashboard/trips");
      },
      onError: (e) => {
        toast.error("Failed to create trip", { description: e.message });
      },
    })
  );

  const updateTrip = useMutation(
    trpc.discover.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Trip updated successfully");
        await queryClient.invalidateQueries(
          trpc.discover.getMany.queryOptions({})
        );
        await queryClient.invalidateQueries(
          trpc.discover.getOne.queryOptions({ id: trip!.id })
        );
        router.push("/dashboard/trips");
      },
      onError: (e) => {
        toast.error("Failed to update trip", { description: e.message });
      },
    })
  );

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(tripFormSchema) as Resolver<CreateFormValues>,
    defaultValues: {
      title: trip?.title ?? "",
      subtitle: trip?.subtitle ?? "",
      description: trip?.description ?? "",
      locationLabel: trip?.locationLabel ?? "",
      durationDays: trip?.durationDays ?? 7,
      // DB stores cents, form shows dollars
      priceUsd: trip ? Math.round(trip.priceUsd / 100) : 0,
      bestSeasonLabel: trip?.bestSeasonLabel ?? "",
      minGroupSize: trip?.minGroupSize ?? 1,
      maxGroupSize: trip?.maxGroupSize ?? 10,
      accentGradient: trip?.accentGradient ?? "",
      status: trip?.status ?? "draft",
      difficulty: trip?.difficulty ?? "moderate",
      tags: trip?.tags ?? [],
      features: trip?.features ?? [],
    },
  });

  const isPending = createTrip.isPending || updateTrip.isPending;

  function onSubmit(values: CreateFormValues) {
    if (isEditing) {
      const payload: UpdateFormValues = { ...values, id: trip.id };
      updateTrip.mutate(payload);
    } else {
      createTrip.mutate(values);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
      >
        {/* ── Left column: main content ── */}
        <div className="space-y-6 md:col-span-2">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="冰島：極光與孤島靈魂" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subtitle */}
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input
                    placeholder="專業旅拍深度 10 日遊"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed trip description shown on the detail page…"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* Tags */}
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormDescription>
                  Keyword badges displayed on the card (e.g. 極光獵人). Press
                  Enter or comma to add.
                </FormDescription>
                <FormControl>
                  <TagsInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Features */}
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormDescription>
                  Highlight pills at the bottom of each card (e.g. 攝影指導).
                  Icons are assigned automatically by position. Press Enter or
                  comma to add.
                </FormDescription>
                <FormControl>
                  <TagsInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ── Right column: settings ── */}
        <div className="space-y-6">
          {/* Submit */}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending
              ? isEditing
                ? "Saving…"
                : "Creating…"
              : isEditing
                ? "Save Changes"
                : "Create Trip"}
          </Button>

          <Separator />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Difficulty */}
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="adventurous">Adventurous</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* Location */}
          <FormField
            control={form.control}
            name="locationLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="冰島, 雷克雅未克" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            control={form.control}
            name="durationDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (days)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="10"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Best Season */}
          <FormField
            control={form.control}
            name="bestSeasonLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Best Season</FormLabel>
                <FormControl>
                  <Input placeholder="Jan - Mar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="priceUsd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (USD, full dollars)</FormLabel>
                <FormDescription>E.g. enter 8800 for $8,800</FormDescription>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="8800"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          {/* Group size */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="minGroupSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Group</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxGroupSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Group</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Accent Gradient */}
          <FormField
            control={form.control}
            name="accentGradient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accent Gradient</FormLabel>
                <FormDescription>
                  Tailwind gradient string for card colour (optional)
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="from-cyan-400/30 via-sky-500/10 to-transparent"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};
