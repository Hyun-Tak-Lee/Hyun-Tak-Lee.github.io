import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  category: z.string(),
  sub_category: z.array(z.string()).optional(),
  title: z.string(),
  pubDate: z.date(),
  description: z.string().optional(),
  author: z.string().default("Hyun-Tak Lee"),
  tags: z.array(z.string()).optional(),
  image: z.object({
    url: z.string().url(),
    alt: z.string()
  }).optional(),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/projects" }),
  schema: postSchema,
});

const techCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/tech" }),
  schema: postSchema,
});

export const collections = {
  projects: projectsCollection,
  tech: techCollection,
};
