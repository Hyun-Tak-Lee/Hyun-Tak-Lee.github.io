import type { ArchitectureData } from "@/content.config";

export interface ProjectHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface ProjectShowcaseItem {
  id: string;
  title: string;
  category: string;
  sub_category?: string[];
  pubDate: Date;
  description?: string;
  tags?: string[];
  image?: {
    url: string;
    alt: string;
  };
  architecture?: ArchitectureData;
  headings: ProjectHeading[];
  Content: any;
}
