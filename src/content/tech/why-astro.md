---
title: "왜 Astro를 선택했는가?"
pubDate: 2026-04-02
category: "Frontend"
sub_category: ["Framework Selector", "Performance"]
description: "정적 블로그 및 포트폴리오 구축을 위해 Astro를 선택한 핵심 이유"
author: "Hyun-Tak Lee"
tags: ["Astro", "Performance", "SEO"]
---

콘텐츠 중심의 정적 사이트에 불필요한 런타임 비용을 줄이고 마크다운 관리 효율을 높이기 위해 Astro를 선택했습니다.

## 1. Zero-JS와 아일랜드 아키텍처 (Islands Architecture)
- 기본적으로 빌드 시점에 순수 HTML/CSS만 생성하여 클라이언트에 불필요한 JavaScript 번들을 전송하지 않습니다.
- 인터랙션이 필요한 UI만 선택적으로 하이드레이션(`client:*`)할 수 있어 초기 로딩 속도가 빠릅니다.

## 2. 타입 안전한 콘텐츠 관리 (Content Collections)
- `content.config.ts`와 Zod 스키마를 통해 마크다운 Frontmatter(제목, 날짜, 카테고리 등)의 타입과 필수 여부를 빌드 타임에 검증합니다.
- 별도 CMS 없이 로컬 `.md` 파일 추가만으로 라우팅과 페이지가 자동 생성됩니다.

## 3. 정적 사이트 생성(SSG) 및 SEO
- 전체 페이지를 정적 HTML로 사전 빌드하여 GitHub Pages 배포에 최적화되어 있습니다.
- `@astrojs/sitemap` 연동과 시맨틱 마크업 구성을 통해 검색 엔진 최적화(SEO)를 간단하게 처리할 수 있습니다.
