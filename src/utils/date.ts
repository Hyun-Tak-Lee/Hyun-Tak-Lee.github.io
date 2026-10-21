const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Seoul",
});

/** 사이트 공통 날짜 표기 (예: 2026. 10. 21.) */
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}
