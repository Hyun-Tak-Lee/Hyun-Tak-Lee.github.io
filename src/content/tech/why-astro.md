---
title: "Astro 선택 이유 및 핵심 아키텍처"
pubDate: 2026-04-02
category: "Frontend"
sub_category: ["Framework", "Architecture"]
description: "콘텐츠 중심 정적 웹사이트 구축을 위한 Astro 프레임워크의 아키텍처 특성과 도입 근거"
author: "Hyun-Tak Lee"
tags: ["Astro", "Performance", "SEO"]
---

Astro는 콘텐츠 중심 웹사이트에 최적화된 정적 사이트 생성(SSG) 기반 웹 프레임워크로, 불필요한 클라이언트 런타임 오버헤드를 제거하고 마크다운 기반 콘텐츠를 타입 안전하게 관리한다.

## 1. Zero-JS와 아일랜드 아키텍처 (Islands Architecture)
- **Zero-JS 기본 전략**: 빌드 시점에 컴포넌트를 순수 HTML과 CSS로 사전 렌더링하여 클라이언트에 불필요한 JavaScript 번들 전송을 배제한다.
- **부분 하이드레이션 (Partial Hydration)**: 상태 관리나 이벤트 처리가 필요한 인터랙티브 UI 컴포넌트만 독립된 아일랜드(Island) 단위로 분리하고 `client:*` 지시자를 통해 선택적으로 하이드레이션한다.

## 2. 타입 안전한 콘텐츠 관리 (Content Layer API)
- **스키마 검증**: `src/content.config.ts`에서 `glob` 로더와 Zod 스키마를 결합하여 마크다운 프론트매터(제목, 작성일, 카테고리, 태그 등)의 데이터 구조와 타입을 빌드 타임에 검증한다.
- **파일 기반 자동 라우팅**: 외부 CMS 의존성 없이 로컬 마크다운(`.md`) 문서 추가만으로 정적 경로 생성(`getStaticPaths`)과 렌더링을 처리한다.

## 3. 정적 사이트 생성(SSG) 및 검색 엔진 최적화(SEO)
- **사전 빌드 최적화**: 전체 페이지를 정적 HTML로 사전 빌드하여 GitHub Pages 및 CDN 환경에서 즉각적인 응답 속도와 높은 초기 렌더링 성능(LCP, TBT)을 보장한다.
- **메타데이터 및 사이트맵 자동화**: 시맨틱 HTML 마크업, 정규 URL(Canonical URL), Open Graph 메타 태그 및 `@astrojs/sitemap` 통합을 통해 검색 엔진 크롤링 효율을 높인다.
