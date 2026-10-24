/**
 * Upload the html-opt17 company-profile photos to R2 under the `about/` prefix
 * so the site /about page can reference them.
 *
 *   npx tsx scripts/upload-about-images.ts
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true, override: false });
import { verifyR2Object, uploadImageToR2 } from "../src/lib/r2";

const SRC = "C:/Users/76758/WorkBuddy/2026-10-14-13-46-17/html-opt17/photos";
const OUT = path.join("scripts", "about-r2-map.json");

async function main() {
  const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
  const map: Record<string, string> = {};

  for (const file of files) {
    const name = file.replace(/\.(jpe?g|png)$/i, "");
    const key = `about/${name}.webp`;
    let url: string;
    try {
      const existing = await verifyR2Object(key);
      url = existing.url;
      console.log(`SKIP (exists): ${key}`);
    } catch {
      const data = await readFile(path.join(SRC, file));
      const up = await uploadImageToR2({
        data,
        key,
        cacheControl: "public, max-age=31536000, immutable",
      });
      url = up.url;
      console.log(`UPLOADED: ${key} — ${up.width}x${up.height} (${up.size} bytes)`);
    }
    map[name] = url;
  }

  await writeFile(OUT, JSON.stringify(map, null, 2), "utf8");
  console.log(`DONE: ${Object.keys(map).length} images -> ${OUT}`);
}

main().catch((error) => {
  console.error("UPLOAD FAILED:", error);
  process.exit(1);
});
