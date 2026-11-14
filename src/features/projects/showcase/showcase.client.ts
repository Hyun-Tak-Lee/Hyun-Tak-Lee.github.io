import {
  bindMobileDrawer,
  readStorageFlag,
  syncPanelToggleButton,
  writeStorageFlag,
} from "@utils/clientPanel";

const STORAGE_SIDEBAR_KEY = "project-sidebar-collapsed";

/**
 * 프로젝트 쇼케이스의 프로젝트 전환, 검색, 사이드바 접기/펼치기 및 아키텍처 그래프 리사이즈를 초기화한다.
 */
export function initProjectShowcase(): void {
  const showcase = document.getElementById("project-showcase");
  if (!showcase) return;

  const projectButtons = document.querySelectorAll<HTMLButtonElement>("[data-project-btn]");
  const projectArticles = document.querySelectorAll<HTMLElement>("[data-project-article]");
  const breadcrumbCat = document.getElementById("active-project-category");
  const breadcrumbTitle = document.getElementById("active-project-title");
  const expandLink = document.getElementById("active-project-expand-link");
  const searchInput = document.querySelector<HTMLInputElement>("[data-project-search]");
  const projectGroups = document.querySelectorAll<HTMLElement>("[data-project-group]");
  const emptyMessage = document.querySelector<HTMLElement>("[data-project-empty]");
  const sidebarColumn = document.getElementById("project-sidebar-column");
  const sidebarToggleButton = showcase.querySelector<HTMLButtonElement>(
    "[data-project-sidebar-toggle]",
  );
  let isSidebarCollapsed = readStorageFlag(STORAGE_SIDEBAR_KEY);

  const drawer = bindMobileDrawer({
    toggleButton: document.getElementById("project-drawer-toggle"),
    closeButton: document.getElementById("project-drawer-close"),
    backdrop: sidebarColumn,
    content: document.getElementById("project-drawer-content"),
  });

  const syncSidebarLayout = (notifyResize = true) => {
    sidebarColumn?.classList.toggle("expanded:block", !isSidebarCollapsed);
    sidebarColumn?.classList.toggle("expanded:hidden", isSidebarCollapsed);

    syncPanelToggleButton(
      sidebarToggleButton,
      !isSidebarCollapsed,
      "프로젝트 목록 펼치기",
      "프로젝트 목록 접기",
    );

    if (notifyResize) {
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("resize"));
      });
    }
  };

  const activateProject = (projectId: string, updateUrl: boolean) => {
    const target = [...projectArticles].find((a) => a.dataset.projectArticle === projectId);
    if (!target) return;

    projectArticles.forEach((article) => article.classList.toggle("hidden", article !== target));

    const nextTitle = target.dataset.title ?? "";
    const nextCategory = target.dataset.category ?? "";

    if (breadcrumbCat) breadcrumbCat.textContent = nextCategory;
    if (breadcrumbTitle) breadcrumbTitle.textContent = nextTitle;
    if (expandLink) {
      expandLink.setAttribute("href", `/projects/${projectId}`);
      expandLink.setAttribute(
        "aria-label",
        nextTitle ? `${nextTitle} 단독 페이지로 보기` : "단독 페이지로 보기",
      );
    }

    projectButtons.forEach((btn) => {
      const isTarget = btn.dataset.projectBtn === projectId;
      btn.setAttribute("aria-current", isTarget ? "true" : "false");
      const details = btn.closest("details");
      if (isTarget && details) details.open = true;
    });

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("file", projectId);
      window.history.replaceState({}, "", url.toString());
    }

    drawer.close();
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
  };

  const filterCatalog = (rawQuery: string) => {
    const query = rawQuery.trim().toLowerCase();

    projectGroups.forEach((group) => {
      let visibleCount = 0;
      group.querySelectorAll<HTMLElement>("[data-project-item]").forEach((li) => {
        const matches = !query || (li.dataset.searchText ?? "").includes(query);
        li.classList.toggle("hidden", !matches);
        if (matches) visibleCount++;
      });
      group.classList.toggle("hidden", visibleCount === 0);
      const countEl = group.querySelector("[data-group-count]");
      if (countEl) countEl.textContent = String(visibleCount);
    });

    const hasResult = [...projectGroups].some((group) => !group.classList.contains("hidden"));
    emptyMessage?.classList.toggle("hidden", hasResult);
  };

  projectButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.projectBtn;
      if (id) activateProject(id, true);
    });
  });

  // 활성 프로젝트 내부 목차 링크 클릭 시 다른 숨겨진 프로젝트의 중복 id 충돌 방지
  showcase.addEventListener("click", (event) => {
    const targetEl = event.target instanceof Element ? event.target : null;
    const tocLink = targetEl?.closest("[data-project-toc-target]");
    if (!tocLink) return;
    const slug = tocLink.getAttribute("data-project-toc-target");
    const activeArticle = tocLink.closest("[data-project-article]");
    if (!slug || !activeArticle) return;

    const headingEl = activeArticle.querySelector(`[id="${CSS.escape(slug)}"]`);
    if (headingEl) {
      event.preventDefault();
      headingEl.scrollIntoView({ behavior: "smooth", block: "start" });
      const url = new URL(window.location.href);
      url.hash = slug;
      window.history.replaceState({}, "", url.toString());
    }
  });

  searchInput?.addEventListener("input", () => {
    filterCatalog(searchInput.value);
  });

  sidebarToggleButton?.addEventListener("click", () => {
    isSidebarCollapsed = !isSidebarCollapsed;
    writeStorageFlag(STORAGE_SIDEBAR_KEY, isSidebarCollapsed);
    syncSidebarLayout();
  });

  syncSidebarLayout(false);

  const initialFile = new URLSearchParams(window.location.search).get("file");
  if (initialFile) activateProject(initialFile, false);
}
