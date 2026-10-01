import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const picture = z
  .string()
  .regex(/^pictures\/[^/]+\.(?:jpe?g|png|webp|avif|svg)$/i);

const projects = defineCollection({
  loader: glob({
    base: './projects',
    pattern: '*/project.md',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    completed: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])$/),
    hero: picture,
    tags: z
      .array(z.string().trim().min(1))
      .default([])
      .transform((tags) => [...new Set(tags.map((tag) => tag.toLowerCase()))]),
    category: z.string().trim().min(1).optional(),
    resources: z
      .array(
        z.object({
          type: z.string().trim().min(1),
          label: z.string().trim().min(1),
          url: z.url().refine((url) => /^https?:\/\//.test(url)),
        }),
      )
      .default([]),
    gallery: z
      .record(
        z.string(),
        z.object({
          caption: z.string().trim().min(1).optional(),
          order: z.number().int().optional(),
        }),
      )
      .optional(),
    seo: z
      .object({
        title: z.string().trim().min(1).optional(),
        description: z.string().trim().min(1).optional(),
        image: picture.optional(),
      })
      .optional(),
  }),
});

export const collections = { projects };
