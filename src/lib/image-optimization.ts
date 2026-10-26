// Keep this allowlist aligned with images.remotePatterns in next.config.ts.
// Unrecognized sources stay direct images, so editorial uploads on other hosts
// continue to work without passing through an optimizer that would reject them.
export function canOptimizeImage(source: string): boolean {
  if (!source || source !== source.trim() || source.startsWith("//") || /[\\\u0000-\u0020]/.test(source)) return false;

  try {
    const relative = source.startsWith("/") && !source.startsWith("//");
    const url = new URL(source, "https://local-image.invalid");
    const pathname = decodeURIComponent(url.pathname);

    // Known animated and vector files should retain their original bytes.
    // Next also detects animation in PNG/WebP payloads and passes those through.
    if (/\.(?:gif|apng|svg)$/i.test(pathname)) return false;
    if (relative) return true;
    if (url.protocol !== "https:" || url.username || url.password) return false;

    if (url.hostname === "media.guoyaometal.com") {
      return url.port === "" && url.search === "";
    }
    return url.hostname === "media.glarivoglass.com";
  } catch {
    return false;
  }
}
