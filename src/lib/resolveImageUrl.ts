// The API returns absolute URLs baked with its own host (often localhost),
// which isn't reachable from a phone. Swap in whichever host the app is
// actually configured to talk to.
export function resolveImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  const base = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (!base) return url;

  const cleanBase = base.replace(/\/$/, "");

  if (/^https?:\/\//i.test(url)) {
    // Absolute URL from the API -> replace just the origin (protocol+host+port)
    return url.replace(/^https?:\/\/[^/]+/i, cleanBase);
  }

  // Relative path -> prefix with the base
  return `${cleanBase}/${url.replace(/^\//, "")}`;
}

export function resolveNoticePdfUrl(
  filename?: string | null,
): string | undefined {
  if (!filename) return undefined;
  const base = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!base) return filename;
  return `${base}/notices/${filename}`;
}