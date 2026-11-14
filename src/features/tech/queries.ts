import { getCollection, render, type CollectionEntry } from "astro:content";
import type { TechWorkspaceItem } from "./types";

export async function getSortedTechPosts(): Promise<CollectionEntry<"tech">[]> {
  const techPosts = await getCollection("tech");
  return [...techPosts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * 기술 문서 저장소 워크스페이스용 아이템 목록을 생성한다.
 */
export async function getTechWorkspaceItems(): Promise<TechWorkspaceItem[]> {
  const sortedTech = await getSortedTechPosts();

  return Promise.all(
    sortedTech.map(async (post) => {
      const { Content, headings } = await render(post);
      return {
        id: post.id,
        title: post.data.title,
        category: post.data.category,
        sub_category: post.data.sub_category,
        pubDate: post.data.pubDate,
        description: post.data.description,
        tags: post.data.tags,
        image: post.data.image,
        headings,
        Content,
      };
    }),
  );
}
