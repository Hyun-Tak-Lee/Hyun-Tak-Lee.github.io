import { getCollection } from "astro:content";
import type { PostData } from "@/content.config";

export type IssueFilter = "all" | "projects" | "tech";

export interface IssueCardItem {
  id: string;
  collectionType: "projects" | "tech";
  data: PostData;
  filters: IssueFilter[];
}

export interface HomeDashboardData {
  projectCount: number;
  techCount: number;
  countsByFilter: Record<IssueFilter, number>;
  displayedIssues: IssueCardItem[];
}

export async function getHomeDashboardData(recentLimit = 5): Promise<HomeDashboardData> {
  const [projects, techPosts] = await Promise.all([
    getCollection("projects"),
    getCollection("tech"),
  ]);

  const allIssues = [
    ...projects.map((post) => ({
      id: post.id,
      collectionType: "projects" as const,
      data: post.data,
    })),
    ...techPosts.map((post) => ({
      id: post.id,
      collectionType: "tech" as const,
      data: post.data,
    })),
  ].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const recentByFilter: Record<IssueFilter, typeof allIssues> = {
    all: allIssues.slice(0, recentLimit),
    projects: allIssues
      .filter((issue) => issue.collectionType === "projects")
      .slice(0, recentLimit),
    tech: allIssues.filter((issue) => issue.collectionType === "tech").slice(0, recentLimit),
  };

  const issueFilters = new Map<(typeof allIssues)[number], IssueFilter[]>();
  for (const [filter, issues] of Object.entries(recentByFilter) as [
    IssueFilter,
    typeof allIssues,
  ][]) {
    for (const issue of issues) {
      issueFilters.set(issue, [...(issueFilters.get(issue) ?? []), filter]);
    }
  }

  const displayedIssues: IssueCardItem[] = allIssues
    .filter((issue) => issueFilters.has(issue))
    .map((issue) => ({
      ...issue,
      filters: issueFilters.get(issue) ?? [],
    }));

  return {
    projectCount: projects.length,
    techCount: techPosts.length,
    countsByFilter: {
      all: recentByFilter.all.length,
      projects: recentByFilter.projects.length,
      tech: recentByFilter.tech.length,
    },
    displayedIssues,
  };
}
