import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/projects" }),
  schema: z.object({
    category: z.string(),
    sub_category: z.array(z.string()).optional(),
    title: z.string(),
    pubDate: z.date(),
    description: z.string().optional(),
    author: z.string().default("Hyun-Tak Lee"),
    tags: z.array(z.string()).optional(),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }).optional(),
  })
});

const techCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/tech" }),
  schema: z.object({
    category: z.string(),
    sub_category: z.array(z.string()).optional(),
    title: z.string(),
    pubDate: z.date(),
    description: z.string().optional(),
    author: z.string().default("Hyun-Tak Lee"),
    tags: z.array(z.string()).optional(),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }).optional(),
  })
});

export const collections = {
  'projects': projectsCollection,
  'tech': techCollection
};
