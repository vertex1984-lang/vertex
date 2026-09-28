/**
 * build-variant-thumbs.js — 挂画家族 PDP 色点缩略图生成（2026-09-28）
 * 从各产品 1.webp 场景图按画框坐标裁出正方形 thumb-crop.webp（176×176 q82），
 * 并生成 src/data/variant-thumb-crops.ts 供 products/[handle]/page.tsx 的色点 thumb 优先使用。
 *
 * 坐标口径：cx/cy = 画框包围盒中心（相对图宽/高的分数），s = 裁剪正方形边长（相对 min(W,H) 的分数）。
 * 口径按"圆点内展示完整花型"调校：s ≈ 花型最大边 × 1.35（圆形裁切下对角略损、花型完整可辨）。
 * 新挂画上架：在 SOURCES 补一条坐标后重跑本脚本即可；无条目的产品走默认白底/首图逻辑。
 */
const fs = require('fs');
const path = require('path');
const sharp = require('../node_modules/sharp');

const ROOT = path.join(__dirname, '..', 'public', 'images', 'products');
const OUT_TS = path.join(__dirname, '..', 'src', 'data', 'variant-thumb-crops.ts');

const SOURCES = {
  '1688-730512046265-c14': { cx: 0.515, cy: 0.307, s: 0.5 },  // Greek Warrior 方幅
  '1688-730512046265-c15': { cx: 0.51, cy: 0.345, s: 0.63 },  // Basket Trio 竖幅 48x38
  '1688-730512046265-c16': { cx: 0.515, cy: 0.29, s: 0.45 },  // Medallion Basket 方幅
  '1688-730512046265-c17': { cx: 0.51, cy: 0.295, s: 0.65 },  // Greek Procession 竖幅 38x48
  '1688-730512046265-c18': { cx: 0.56, cy: 0.32, s: 0.33 },   // Pottery & Plates 方幅（画偏右上）
  '1688-730512046265-c19': { cx: 0.59, cy: 0.305, s: 0.32 },  // Basket Vases 方幅（画偏右上）
};

(async () => {
  const allDirs = fs.readdirSync(ROOT);
  const entries = [];
  for (const [asin, { cx, cy, s }] of Object.entries(SOURCES)) {
    const dir = allDirs.find((d) => d.toLowerCase() === asin);
    if (!dir) { console.log(`MISSING DIR: ${asin}`); process.exit(1); }
    const src = path.join(ROOT, dir, '1.webp');
    if (!fs.existsSync(src)) { console.log(`MISSING IMG: ${asin}`); process.exit(1); }
    const meta = await sharp(src).metadata();
    const W = meta.width, H = meta.height;
    const side = Math.round(s * Math.min(W, H));
    const left = Math.max(0, Math.min(Math.round(cx * W - side / 2), W - side));
    const top = Math.max(0, Math.min(Math.round(cy * H - side / 2), H - side));
    const dest = path.join(ROOT, dir, 'thumb-crop.webp');
    await sharp(src).extract({ left, top, width: side, height: side }).resize(176, 176).webp({ quality: 82 }).toFile(dest);
    entries.push(`  '${asin}': '/images/products/${dir}/thumb-crop.webp',`);
    console.log(`${dir}: extract ${side}px @ (${left},${top}) of ${W}x${H}`);
  }
  const ts = `/**
 * PDP 色点缩略图裁剪版（挂画家族专用，2026-09-28 领导要求：圆点展示完整本体花型）
 * 由 scripts/build-variant-thumbs.js 生成——从各产品 1.webp 场景图按画框坐标裁出 thumb-crop.webp。
 * products/[handle]/page.tsx 的色点 thumb 优先取本表；不在表内的产品走默认白底/首图逻辑。
 * 新挂画上架：scripts/build-variant-thumbs.js 的 SOURCES 补坐标后重跑。
 */
export const VARIANT_THUMB_CROPS: Record<string, string> = {
${entries.join('\n')}
};
`;
  fs.writeFileSync(OUT_TS, ts);
  console.log(`written: ${OUT_TS} (${entries.length} entries)`);
})();
