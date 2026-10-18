# AGENTS.md

## Directory Structure
- `src/layouts/`: `<slot />`을 포함하는 페이지 레이아웃
- `src/components/`: 재사용 UI 컴포넌트 (`Header.astro`, `BaseHead.astro`, `icons/`)
- `src/pages/`: 파일 기반 라우팅 페이지
- `src/content/`: Content Collections 마크다운 문서 (`projects/`, `tech/`)
- `src/styles/`: 전역 스타일 엔트리(`global.css`), 디자인 토큰(`theme.css`), 기본 태그 스타일(`base.css`)

## Astro Rules
- **Static First**: 정적 UI는 `.astro`로 작성하고 프론트매터에 `interface Props` 명시.
- **Partial Hydration**: 인터랙션은 `<script>`를 우선 사용하고, React(`.tsx`)는 필수 시에만 최소한의 `client:*` 지시자로 사용.
- **Content Layer API**: `src/content.config.ts`(`glob` 로더 + Zod)로 스키마를 정의하고 `getCollection()`, `render(entry)`, `entry.id` 사용.

## Tailwind CSS v4 Rules
- **CSS-First 설정**: `tailwind.config.js` 및 Sass/Less 전처리기 사용 금지.
- **테마 토큰**: `src/styles/theme.css`의 `@theme` 블록(`--color-*`, `--shadow-*`, `--background-image-*`)과 `light-dark()`로 정의.
- **v4 유틸리티**: 구버전 대신 v4 표준 클래스 사용 (예: `bg-linear-to-r`).

## Frontend & Content Standards
- **Heading 계층**: 페이지당 `<h1>`은 하나만 유지 (상세 페이지 제목이 `<h1>`이므로 마크다운 본문은 `##`부터 작성).
- **시맨틱 & 접근성**: 시맨틱 태그를 사용하고 이미지 `alt`, 아이콘 버튼 `aria-label` 필수 지정.
- **외부 링크 보안**: `target="_blank"` 사용 시 `rel="noopener noreferrer"` 필수 명시.
