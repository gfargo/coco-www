/**
 * Cache-busting version tag for local media (screenshots + GIFs under
 * /public/screenshots).
 *
 * Stills are served through next/image (Vercel's image optimizer) and
 * GIFs through a plain <img>; both cache by URL. When a screenshot is
 * regenerated under the SAME filename, the optimizer and CDN keep
 * serving the previously-cached bytes until the URL changes. Appending
 * `?v=<ASSET_VERSION>` makes a refreshed file a new cache key so the new
 * media is actually picked up.
 *
 * Bump ASSET_VERSION whenever you re-run `npm run screenshot:sync` (in
 * the coco repo) and copy fresh assets in. The value is opaque; a date
 * is just an easy, monotonic choice.
 */
export const ASSET_VERSION = "2026-07-02"

/**
 * Append the asset version to a local ("/"-rooted) media URL. External
 * URLs, data URIs, and already-versioned URLs are returned unchanged, so
 * it is safe to apply more than once along a render path.
 */
export function versionedAsset(src: string): string {
  if (!src.startsWith("/")) return src
  if (/[?&]v=/.test(src)) return src
  const separator = src.includes("?") ? "&" : "?"
  return `${src}${separator}v=${ASSET_VERSION}`
}
