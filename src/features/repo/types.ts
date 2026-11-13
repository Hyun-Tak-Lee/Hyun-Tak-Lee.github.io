import type { ArchitectureData } from "../../content.config";

export interface RepoHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface RepoTreeItem {
  id: string;
  title: string;
  category: string;
  sub_category?: string[];
  tags?: string[];
}

export interface RepoInspectorItem {
  id: string;
  category: string;
  sub_category?: string[];
  pubDate: Date;
  tags?: string[];
  headings: RepoHeading[];
}

export interface WorkspaceItem extends RepoTreeItem, RepoInspectorItem {
  description?: string;
  architecture?: ArchitectureData;
  Content: any;
}

