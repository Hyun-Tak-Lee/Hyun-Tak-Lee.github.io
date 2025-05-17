import { defineCollection, z } from 'astro:content';

const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    category: z.string(),
    sub_category: z.array(z.string()),
    title: z.string(),
    pubDate: z.date(),
    description: z.string().optional(),
    author: z.string().default("Hyun-Tak Lee"),
    image: z.object({
      url: z.string(),
      alt: z.string()
    }).optional(),
  })
});

export const collections = {
  'post': postCollection
}; 