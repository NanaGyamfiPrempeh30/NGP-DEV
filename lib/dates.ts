const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2025-11" -> "Nov 2025", "2026-04-18" -> "18 Apr 2026", "2020" -> "2020".
export function formatDate(value: string): string {
  const [year, month, day] = value.split("-");
  if (!year) return value;
  if (!month) return year;
  const name = months[Number(month) - 1];
  if (!name) return value;
  return day ? `${Number(day)} ${name} ${year}` : `${name} ${year}`;
}

export function formatRange(start: string, end?: string): string {
  return `${formatDate(start)} to ${end ? formatDate(end) : "present"}`;
}
