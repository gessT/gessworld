import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TRPCError } from "@trpc/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

function buildExifContext(input: {
  make?: string;
  model?: string;
  lensModel?: string;
  focalLength35mm?: number;
  fNumber?: number;
  exposureTime?: number;
  iso?: number;
}) {
  const shutterStr = input.exposureTime
    ? input.exposureTime < 1
      ? `1/${Math.round(1 / input.exposureTime)}s`
      : `${input.exposureTime}s`
    : null;

  const parts: string[] = [];
  if (input.make || input.model) parts.push(`Camera: ${[input.make, input.model].filter(Boolean).join(" ")}`);
  if (input.lensModel) parts.push(`Lens: ${input.lensModel}`);
  if (input.focalLength35mm) parts.push(`Focal length: ${input.focalLength35mm}mm`);
  if (input.fNumber) parts.push(`Aperture: ƒ/${input.fNumber}`);
  if (shutterStr) parts.push(`Shutter: ${shutterStr}`);
  if (input.iso) parts.push(`ISO: ${input.iso}`);
  return parts.length ? parts.join("\n") : "No technical details available.";
}

async function callGemini(prompt: string): Promise<string> {
  const geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });
  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text().trim();
    // Strip optional markdown code fences
    return text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[AI] Gemini error:", msg);
    if (msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests")) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "AI quota exceeded — try again in a minute.",
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `AI generation failed: ${msg}`,
    });
  }
}

const exifInput = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  lensModel: z.string().optional(),
  focalLength35mm: z.number().optional(),
  fNumber: z.number().optional(),
  exposureTime: z.number().optional(),
  iso: z.number().optional(),
});

export const aiRouter = createTRPCRouter({
  // Generate a title from EXIF data
  generateTitle: protectedProcedure
    .input(exifInput)
    .mutation(async ({ input }) => {
      const context = buildExifContext(input);
      const prompt = `You are a creative photography assistant.

Based on this photo's technical metadata, generate a short evocative title.

${context}

Rules:
- Max 6 words, no quotes
- Poetic but not cliché
- Do NOT mention camera brand or lens model
- Reply ONLY with valid JSON: {"title": "..."}`;

      const text = await callGemini(prompt);
      try {
        const parsed = JSON.parse(text) as { title?: string };
        return { title: parsed.title ?? "" };
      } catch {
        // Fallback: extract first quoted string if model didn't return pure JSON
        const match = text.match(/["']([^"']{3,80})["']/);
        return { title: match?.[1] ?? text.slice(0, 60) };
      }
    }),

  // Generate a description based on the title (+ optional EXIF)
  generateDescription: protectedProcedure
    .input(exifInput.extend({ title: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const context = buildExifContext(input);
      const prompt = `You are a creative photography assistant.

The photo is titled: "${input.title}"

Additional technical context:
${context}

Write a 1–2 sentence description (20–40 words) that expands on the title with mood, light, or sense of place.
Do NOT mention camera brand or technical specs.
Reply ONLY with valid JSON: {"description": "..."}`;

      const text = await callGemini(prompt);
      try {
        const parsed = JSON.parse(text) as { description?: string };
        return { description: parsed.description ?? "" };
      } catch {
        // Fallback: return the raw text trimmed
        return { description: text.slice(0, 300) };
      }
    }),
});
