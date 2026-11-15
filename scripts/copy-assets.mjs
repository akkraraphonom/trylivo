#!/usr/bin/env node
/**
 * Copies images, videos and the General Sans font from the offline Framer
 * mirror (../framerusercontent.com) into ./public so Next.js can serve them.
 *
 *   node scripts/copy-assets.mjs                 # copy (overwrite)
 *   node scripts/copy-assets.mjs --if-missing    # skip when public/images already has files
 *   node scripts/copy-assets.mjs --src <dir>     # custom mirror location
 *
 * Framer stores several resized copies of each image
 * (`<id>__q__scale-down-to=512;;width=...png`). Only the full-size file is
 * copied and it is renamed to `<id>.<ext>`, which is what src/data/*.json uses.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const srcArg = args.indexOf("--src");
const src = path.resolve(
  srcArg >= 0 ? args[srcArg + 1] : process.env.ECOM_ASSETS_DIR ?? path.join(root, "..", "framerusercontent.com"),
);
const pub = path.join(root, "public");

if (args.includes("--if-missing")) {
  const imgDir = path.join(pub, "images");
  if (fs.existsSync(imgDir) && fs.readdirSync(imgDir).length > 0) process.exit(0);
}

if (!fs.existsSync(src)) {
  console.warn(`[assets] Mirror folder not found: ${src}\n[assets] Images will be missing. Pass --src <path-to-framerusercontent.com>.`);
  process.exit(0);
}

const ensure = (d) => fs.mkdirSync(d, { recursive: true });
let count = { images: 0, videos: 0, fonts: 0 };

// images
const imgSrc = path.join(src, "images");
if (fs.existsSync(imgSrc)) {
  ensure(path.join(pub, "images"));
  for (const name of fs.readdirSync(imgSrc)) {
    if (name.includes("scale-down-to")) continue;
    const full = name.match(/^([A-Za-z0-9]+)__q__width=\d+;;height=\d+\.(png|jpe?g|webp|svg)$/);
    const plain = name.match(/^([A-Za-z0-9]+)\.(png|jpe?g|webp|svg)$/);
    const m = full ?? plain;
    if (!m) continue;
    fs.copyFileSync(path.join(imgSrc, name), path.join(pub, "images", `${m[1]}.${m[2]}`));
    count.images++;
  }
}

// videos
const assetSrc = path.join(src, "assets");
if (fs.existsSync(assetSrc)) {
  ensure(path.join(pub, "videos"));
  for (const name of fs.readdirSync(assetSrc)) {
    if (!name.endsWith(".mp4")) continue;
    fs.copyFileSync(path.join(assetSrc, name), path.join(pub, "videos", name));
    count.videos++;
  }
}

// General Sans (Fontshare) — variable + static fallbacks
const fonts = {
  "GeneralSans-Variable.woff2": "LHQJ5KSAL7VGAEIDSTEXCCOIUKFLT2I6/GW57XUEG4ZBVMLZZTQZTGYPROITRRQ5W/JA3IZUEMJ2J6WWT2OQVJOAWDXO3YL4YG.woff2",
};
ensure(path.join(pub, "fonts"));
for (const [out, rel] of Object.entries(fonts)) {
  const f = path.join(src, "third-party-assets", "fontshare", "wf", ...rel.split("/"));
  if (fs.existsSync(f)) {
    fs.copyFileSync(f, path.join(pub, "fonts", out));
    count.fonts++;
  }
}

console.log(`[assets] copied ${count.images} images, ${count.videos} videos, ${count.fonts} fonts from ${src}`);
