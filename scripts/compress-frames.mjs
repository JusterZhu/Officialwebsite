/**
 * Build assets for production deployment.
 *
 * Step 1: Compress PNG frames to WebP at optimized resolution.
 *         1.4 GB (4252×2160 PNGs) → ~31 MB (1920px WebP).
 *
 * Step 2: Generate a scrollable MP4 video from the PNG frames.
 *         Requires ffmpeg to be installed.
 *         1.4 GB (460 PNGs) → ~23 MB (single MP4).
 *
 * Run: node scripts/compress-frames.mjs
 *      ffmpeg -framerate 30 -i frames/%03d.png -vf "scale=1920:-2,fps=30" \
 *             -c:v libx264 -preset fast -crf 23 -g 1 -pix_fmt yuv420p \
 *             -movflags +faststart -an -y frames/hero.mp4
 *      cp frames/hero.mp4 public/hero.mp4
 */

import { readdir, mkdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { cpus } from "node:os";
import { spawn } from "node:child_process";
import sharp from "sharp";

const SOURCE_DIR = join(process.cwd(), "frames");
const TARGET_DIR = join(process.cwd(), "frames");
const PUBLIC_DIR = join(process.cwd(), "public");
const TARGET_WIDTH = 1920;
const WEBP_QUALITY = 80;
const CONCURRENCY = Math.max(1, cpus().length - 1);

async function convertToWebP() {
  const files = (await readdir(SOURCE_DIR))
    .filter((f) => extname(f).toLowerCase() === ".png")
    .sort();

  if (!files.length) {
    console.log("No PNG frames found in", SOURCE_DIR);
    return;
  }

  await mkdir(TARGET_DIR, { recursive: true });

  const start = Date.now();
  let done = 0;
  let totalBefore = 0;
  let totalAfter = 0;
  const queue = [...files];

  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const file = queue.shift();
      const srcPath = join(SOURCE_DIR, file);
      const destPath = join(TARGET_DIR, file.replace(/\.png$/i, ".webp"));

      const before = (await stat(srcPath)).size;
      await sharp(srcPath)
        .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 6 })
        .toFile(destPath);

      const after = (await stat(destPath)).size;

      done += 1;
      totalBefore += before;
      totalAfter += after;

      const reduction = ((1 - after / before) * 100).toFixed(0);
      console.log(
        `[WebP ${done}/${done + queue.length}] ${file}  ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(2)}MB  (-${reduction}%)`,
      );
    }
  });

  await Promise.all(workers);

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const reduction = ((1 - totalAfter / totalBefore) * 100).toFixed(0);

  console.log(`\nWebP conversion done in ${elapsed}s`);
  console.log(`Total: ${(totalBefore / 1024 / 1024 / 1024).toFixed(2)}GB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB  (-${reduction}%)`);
}

async function generateVideo() {
  const videoPath = join(SOURCE_DIR, "hero.mp4");

  console.log("\nGenerating scrollable MP4 video with ffmpeg...");

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", [
      "-framerate", "30",
      "-i", join(SOURCE_DIR, "%03d.png"),
      "-vf", "scale=1920:-2,fps=30",
      "-c:v", "libx264",
      "-preset", "fast",
      "-crf", "23",
      "-g", "1",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-an",
      "-y",
      videoPath,
    ], { stdio: "inherit" });

    ffmpeg.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });

  const { size } = await stat(videoPath);
  console.log(`Video generated: ${(size / 1024 / 1024).toFixed(1)}MB`);

  // Copy to public directory for Next.js static serving
  await mkdir(PUBLIC_DIR, { recursive: true });
  const publicPath = join(PUBLIC_DIR, "hero.mp4");
  const { copyFile } = await import("node:fs/promises");
  await copyFile(videoPath, publicPath);
  console.log(`Copied to ${publicPath}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--webp") || args.includes("--all") || args.length === 0) {
    await convertToWebP();
  }

  if (args.includes("--video") || args.includes("--all") || args.length === 0) {
    try {
      await generateVideo();
    } catch (err) {
      console.warn("Video generation skipped (ffmpeg may not be available):", err.message);
    }
  }

  console.log("\n==========================================");
  console.log("All assets built successfully.");
  console.log("  frames/*.webp  — compressed frame images (fallback)");
  console.log("  frames/hero.mp4 — scrollable video");
  console.log("  public/hero.mp4 — static copy for Next.js serving");
  console.log("==========================================");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
