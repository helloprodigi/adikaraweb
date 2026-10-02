import { readdirSync } from "node:fs";
import path from "node:path";

// Server-only: reads public/gallery at build time so new photos are picked
// up automatically without touching this file.
const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

export function getGalleryImages(): string[] {
  try {
    return readdirSync(GALLERY_DIR)
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort()
      .map((file) => `/gallery/${file}`);
  } catch {
    return [];
  }
}
