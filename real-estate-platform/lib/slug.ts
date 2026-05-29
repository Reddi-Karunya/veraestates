export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uniqueSlug(base: string, suffix?: string): string {
  const slug = slugify(base);
  if (suffix) return `${slug}-${suffix}`;
  const shortId = Math.random().toString(36).slice(2, 8);
  return `${slug}-${shortId}`;
}
