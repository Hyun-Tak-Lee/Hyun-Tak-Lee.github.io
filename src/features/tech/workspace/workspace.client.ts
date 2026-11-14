import {
  bindMobileDrawer,
  readStorageFlag,
  syncPanelToggleButton,
  writeStorageFlag,
} from "@utils/clientPanel";

const STORAGE_EXPLORER_KEY = "tech-explorer-collapsed";
const STORAGE_INSPECTOR_KEY = "tech-inspector-collapsed";

/**
 * 기술 문서 저장소 워크스페이스의 파일 전환, 검색, 패널 토글 및 모바일 드로어를 초기화한다.
 */
export function initTechWorkspace(): void {
  const workspace = document.getElementById("tech-workspace");
  if (!workspace) return;

  const fileButtons = document.querySelectorAll<HTMLButtonElement>("[data-tech-file-btn]");
  const viewerArticles = document.querySelectorAll<HTMLElement>("[data-tech-viewer-article]");
  const inspectorPanels = document.querySelectorAll<HTMLElement>("[data-tech-inspector-panel]");
  const breadcrumbCat = document.getElementById("tech-breadcrumb-category");
  const breadcrumbTitle = document.getElementById("tech-breadcrumb-title");
  const searchInput = document.querySelector<HTMLInputElement>("[data-tech-search]");
  const treeFolders = document.querySelectorAll<HTMLElement>("[data-tech-folder]");
  const treeEmptyMessage = document.querySelector<HTMLElement>("[data-tech-empty]");
  const explorerColumn = document.getElementById("tech-explorer-column");
  const inspectorColumn = document.getElementById("tech-inspector-column");
  const explorerToggleButton = workspace.querySelector<HTMLButtonElement>(
    "[data-tech-explorer-toggle]",
  );
  const inspectorToggleButton = workspace.querySelector<HTMLButtonElement>(
    "[data-tech-inspector-toggle]",
  );
  const inspectorCloseButton = workspace.querySelector<HTMLButtonElement>(
    "[data-tech-inspector-close]",
  );
  const inspectorFallbacks = workspace.querySelectorAll<HTMLElement>(
    "[data-tech-inspector-fallback]",
  );

  let isExplorerCollapsed = readStorageFlag(STORAGE_EXPLORER_KEY);
  let isInspectorCollapsed = readStorageFlag(STORAGE_INSPECTOR_KEY);

  const drawer = bindMobileDrawer({
    toggleButton: document.getElementById("tech-drawer-toggle"),
    closeButton: document.getElementById("tech-drawer-close"),
    backdrop: explorerColumn,
    content: document.getElementById("tech-drawer-content"),
  });

  const syncPanelLayout = () => {
    explorerColumn?.classList.toggle("expanded:block", !isExplorerCollapsed);
    explorerColumn?.classList.toggle("expanded:hidden", isExplorerCollapsed);
    inspectorColumn?.classList.toggle("large:block", !isInspectorCollapsed);

    inspectorFallbacks.forEach((el) => {
      el.classList.toggle("large:hidden", !isInspectorCollapsed);
    });

    syncPanelToggleButton(
      explorerToggleButton,
      !isExplorerCollapsed,
      "저장소 탐색기 펼치기",
      "저장소 탐색기 접기",
    );
    syncPanelToggleButton(
      inspectorToggleButton,
      !isInspectorCollapsed,
      "인스펙터 열기",
      "인스펙터 닫기",
    );
  };

  const activateFile = (fileId: string, updateUrl: boolean) => {
    const target = [...viewerArticles].find((a) => a.dataset.techViewerArticle === fileId);
    if (!target) return;

    viewerArticles.forEach((article) => article.classList.toggle("hidden", article !== target));
    inspectorPanels.forEach((panel) =>
      panel.classList.toggle("hidden", panel.dataset.techInspectorPanel !== fileId),
    );
    if (breadcrumbCat) breadcrumbCat.textContent = target.dataset.category ?? "";
    if (breadcrumbTitle) breadcrumbTitle.textContent = `${fileId}.md`;

    fileButtons.forEach((btn) => {
      const isTarget = btn.dataset.techFileBtn === fileId;
      btn.setAttribute("aria-current", isTarget ? "true" : "false");
      const details = btn.closest("details");
      if (isTarget && details) details.open = true;
    });

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("file", fileId);
      window.history.replaceState({}, "", url.toString());
    }

    drawer.close();
  };

  const filterTree = (rawQuery: string) => {
    const query = rawQuery.trim().toLowerCase();

    treeFolders.forEach((folder) => {
      let visibleCount = 0;
      folder.querySelectorAll<HTMLElement>("[data-tech-item]").forEach((li) => {
        const matches = !query || (li.dataset.searchText ?? "").includes(query);
        li.classList.toggle("hidden", !matches);
        if (matches) visibleCount++;
      });
      folder.classList.toggle("hidden", visibleCount === 0);
      const countEl = folder.querySelector("[data-folder-count]");
      if (countEl) countEl.textContent = String(visibleCount);
    });

    const hasResult = [...treeFolders].some((folder) => !folder.classList.contains("hidden"));
    treeEmptyMessage?.classList.toggle("hidden", hasResult);
  };

  fileButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.techFileBtn;
      if (id) activateFile(id, true);
    });
  });

  searchInput?.addEventListener("input", () => {
    filterTree(searchInput.value);
  });

  explorerToggleButton?.addEventListener("click", () => {
    isExplorerCollapsed = !isExplorerCollapsed;
    writeStorageFlag(STORAGE_EXPLORER_KEY, isExplorerCollapsed);
    syncPanelLayout();
  });

  inspectorToggleButton?.addEventListener("click", () => {
    isInspectorCollapsed = !isInspectorCollapsed;
    writeStorageFlag(STORAGE_INSPECTOR_KEY, isInspectorCollapsed);
    syncPanelLayout();
  });

  inspectorCloseButton?.addEventListener("click", () => {
    isInspectorCollapsed = true;
    writeStorageFlag(STORAGE_INSPECTOR_KEY, true);
    syncPanelLayout();
  });

  syncPanelLayout();

  const initialFile = new URLSearchParams(window.location.search).get("file");
  if (initialFile) activateFile(initialFile, false);
}
