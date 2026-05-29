/** Allow only same-origin relative paths (blocks open redirects). */
export function getSafeRedirectPath(
  path: string | null | undefined,
  fallback = "/admin"
): string {
  if (!path) return fallback;
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  if (path.includes("://") || path.includes("\\")) return fallback;
  return path;
}
