/**
 * localStorage에서 불리언 플래그를 안전하게 읽는다.
 */
export function readStorageFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

/**
 * localStorage에 불리언 플래그를 안전하게 저장한다.
 */
export function writeStorageFlag(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? "true" : "false");
  } catch {
    // 스토리지 접근 제한 환경 무시
  }
}

/**
 * 사이드바·인스펙터 토글 버튼의 접근성 속성과 활성 스타일을 동기화한다.
 */
export function syncPanelToggleButton(
  btn: HTMLElement | null,
  isOpen: boolean,
  openLabel: string,
  closeLabel: string,
): void {
  if (!btn) return;
  const nextLabel = isOpen ? closeLabel : openLabel;
  btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  btn.setAttribute("aria-label", nextLabel);
  btn.setAttribute("title", nextLabel);
  btn.classList.toggle("bg-brand-soft", isOpen);
  btn.classList.toggle("border-brand/35", isOpen);
  btn.classList.toggle("text-brand", isOpen);
  btn.classList.toggle("bg-glass-bg", !isOpen);
  btn.classList.toggle("border-glass-border", !isOpen);
  btn.classList.toggle("text-text-muted", !isOpen);
}

export interface DrawerControlsOptions {
  toggleButton: HTMLElement | null;
  closeButton: HTMLElement | null;
  backdrop: HTMLElement | null;
  content: HTMLElement | null;
}

/**
 * 모바일 슬라이드 드로어 열기/닫기 제어 및 이벤트를 연결한다.
 */
export function bindMobileDrawer({
  toggleButton,
  closeButton,
  backdrop,
  content,
}: DrawerControlsOptions): { open: () => void; close: () => void } {
  const close = () => {
    if (!backdrop || !content) return;
    backdrop.classList.add("opacity-0", "invisible", "pointer-events-none");
    backdrop.classList.remove("opacity-100", "visible", "pointer-events-auto");
    content.classList.add("-translate-x-full");
  };

  const open = () => {
    if (!backdrop || !content) return;
    backdrop.classList.remove("opacity-0", "invisible", "pointer-events-none");
    backdrop.classList.add("opacity-100", "visible", "pointer-events-auto");
    content.classList.remove("-translate-x-full");
  };

  toggleButton?.addEventListener("click", open);
  closeButton?.addEventListener("click", close);
  backdrop?.addEventListener("click", (event) => {
    if (event.target === backdrop) close();
  });

  return { open, close };
}
