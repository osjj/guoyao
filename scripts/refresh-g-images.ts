/**
 * Re-upload the regenerated html-opt8 images to their existing R2 keys so the
 * Murray Road case draft and the delivered HTML stay visually in sync.
 *
 *   npx tsx scripts/refresh-g-images.ts
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ path: ".env", quiet: true, override: false });
import { uploadImageToR2 } from "../src/lib/r2";

const SLUG = "case-studies/murray-road-column-cladding";
const SRC = "C:/Users/76758/WorkBuddy/2026-10-14-13-46-17/html-opt8";
const MAP: Array<[string, string]> = [
  ["photos/g01.jpg", `${SLUG}/01-inquiry-and-design-briefing.webp`],
  ["photos/g02.jpg", `${SLUG}/02-site-survey-laser-measurement.webp`],
  ["photos/g03.jpg", `${SLUG}/03-shop-drawings-flat-patterns.webp`],
  ["photos/g04.jpg", `${SLUG}/04-sealed-curved-sample-approval.webp`],
  ["photos/g06.jpg", `${SLUG}/33-tig-welding-longitudinal-joint.webp`],
  ["photos/g07.jpg", `${SLUG}/49-export-packing-fitted-crate.webp`],
  ["photos/g08.jpg", `${SLUG}/50-container-loading-40ft.webp`],
  ["photos/g10.jpg", `${SLUG}/52-site-seam-alignment.webp`],
  ["photos/g11.jpg", `${SLUG}/53-client-acceptance-inspection.webp`],
  ["photos/g12.jpg", `${SLUG}/54-aftercare-along-the-grain.webp`],
];

async function main() {
  for (const [file, key] of MAP) {
    const data = await readFile(path.join(SRC, file));
    const up = await uploadImageToR2({
      data,
      key,
      cacheControl: "public, max-age=31536000, immutable",
    });
    console.log(`${key.split("/").pop()} — ${up.width}x${up.height} (${up.size} bytes)`);
  }
  console.log("DONE:", MAP.length, "images refreshed");
}

main().catch((error) => {
  console.error("REFRESH FAILED:", error);
  process.exit(1);
});
