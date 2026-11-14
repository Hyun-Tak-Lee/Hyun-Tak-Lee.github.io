export interface TechHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface TechTreeItem {
  id: string;
  title: string;
  category: string;
  sub_category?: string[];
  tags?: string[];
}

export interface TechInspectorItem {
  id: string;
  category: string;
  sub_category?: string[];
  pubDate: Date;
  tags?: string[];
  headings: TechHeading[];
}

export interface TechWorkspaceItem extends TechTreeItem, TechInspectorItem {
  description?: string;
  image?: {
    url: string;
    alt: string;
  };
  Content: any;
}
