import { getCollection, render, type CollectionEntry } from "astro:content";
import type { ArchitectureData } from "@/content.config";
import type { ProjectShowcaseItem } from "./types";
import { mergeArchitectureFragments } from "./architecture/architecture";

export interface EnrichedProjectEntry {
  entry: CollectionEntry<"projects">;
  architecture?: ArchitectureData;
}

/**
 * 프로젝트 엔트리와 해당 프로젝트 폴더 내 아키텍처 정의(architecture.yaml 또는 architecture/*.yaml)를 결합한다.
 */
export async function getEnrichedProjects(): Promise<EnrichedProjectEntry[]> {
  const [projects, architectureFragments] = await Promise.all([
    getCollection("projects"),
    getCollection("projectArchitectures"),
  ]);

  const sortedProjects = [...projects].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return sortedProjects.map((project) => {
    const matchedFragments = architectureFragments.filter(
      (frag) =>
        frag.id === `${project.id}/architecture` ||
        frag.id.startsWith(`${project.id}/architecture/`),
    );

    const architecture = mergeArchitectureFragments(matchedFragments, project.data.architecture);

    return {
      entry: project,
      architecture,
    };
  });
}

/**
 * 프로젝트 쇼케이스 화면용 아이템 목록을 생성한다.
 */
export async function getProjectShowcaseItems(): Promise<ProjectShowcaseItem[]> {
  const enrichedProjects = await getEnrichedProjects();
  return Promise.all(
    enrichedProjects.map(async ({ entry, architecture }) => {
      const { Content, headings } = await render(entry);
      return {
        id: entry.id,
        title: entry.data.title,
        category: entry.data.category,
        sub_category: entry.data.sub_category,
        pubDate: entry.data.pubDate,
        description: entry.data.description,
        tags: entry.data.tags,
        image: entry.data.image,
        architecture,
        headings,
        Content,
      };
    }),
  );
}
