import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const architectureGroupSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
});

export const architectureNodeSchema = z.object({
  id: z.string(),
  group: z.string(),
  title: z.string(),
  role: z.string().optional(),
  summary: z.string(),
  tech: z.array(z.string()).optional(),
  details: z.array(z.string()).optional(),
});

export const architectureEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
  bidirectional: z.boolean().optional(),
});

export const architectureSchema = z.object({
  summary: z.string().optional(),
  groups: z.array(architectureGroupSchema),
  nodes: z.array(architectureNodeSchema),
  edges: z.array(architectureEdgeSchema).optional(),
});

export const architectureFragmentSchema = z.object({
  order: z.number().optional(),
  summary: z.string().optional(),
  groups: z.array(architectureGroupSchema).optional(),
  nodes: z.array(architectureNodeSchema).optional(),
  edges: z.array(architectureEdgeSchema).optional(),
});

export type ArchitectureGroup = z.infer<typeof architectureGroupSchema>;
export type ArchitectureNode = z.infer<typeof architectureNodeSchema>;
export type ArchitectureEdge = z.infer<typeof architectureEdgeSchema>;
export type ArchitectureData = z.infer<typeof architectureSchema>;
export type ArchitectureFragment = z.infer<typeof architectureFragmentSchema>;

export const postSchema = z.object({
  category: z.string(),
  sub_category: z.array(z.string()).optional(),
  title: z.string(),
  pubDate: z.date(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  image: z
    .object({
      url: z.url(),
      alt: z.string(),
    })
    .optional(),
  architecture: architectureSchema.optional(),
});

export type PostData = z.infer<typeof postSchema>;

const normalizeContentId = ({ entry }: { entry: string }) =>
  entry
    .replace(/\\/g, "/")
    .replace(/\/index\.(md|mdx)$/, "")
    .replace(/\.(md|mdx)$/, "");

const projectsCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/projects",
    generateId: normalizeContentId,
  }),
  schema: postSchema,
});

const projectArchitecturesCollection = defineCollection({
  loader: glob({
    pattern: ["**/architecture.{yaml,yml,json}", "**/architecture/*.{yaml,yml,json}"],
    base: "./src/content/projects",
    generateId: ({ entry }) => entry.replace(/\\/g, "/").replace(/\.(yaml|yml|json)$/, ""),
  }),
  schema: architectureFragmentSchema,
});

const techCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/tech",
    generateId: normalizeContentId,
  }),
  schema: postSchema,
});

export const collections = {
  projects: projectsCollection,
  projectArchitectures: projectArchitecturesCollection,
  tech: techCollection,
};
