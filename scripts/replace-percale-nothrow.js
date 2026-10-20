/**
 * replace-percale-nothrow.js — 用去盖毯新版替换 percale 5 色正式主图（2026-10-20 用户定）
 * 源 = staging/percale-<color>-nothrow-1x1.png（必需）/ -nothrow-3x4.png（有则替换 PDP 竖版）
 * 目标 = public/images/products/PERCALE-<COLOR>-<SIZE>/1.webp（1200x1200 q82，同 replace-percale-v2 口径）
 *        及 1-3x4.webp（宽 1200 等比 q82）；同步写 out/；原图备份到 scripts/image-backup/（-v2-backup）
 * 用法: node scripts/replace-percale-nothrow.js
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const colors = ['SKY', 'MIST', 'COCONUT', 'NUDE', 'LAVENDER'];
const sizes = ['TWIN', 'FULL', 'QUEEN', 'KING'];
const backupDir = path.join(__dirname, 'image-backup');

(async () => {
  for (const color of colors) {
    const key = color.toLowerCase();
    const src11 = path.join(root, 'public/images/staging', `percale-${key}-nothrow-1x1.png`);
    if (!fs.existsSync(src11)) { console.error('MISSING staging:', src11); continue; }
    const buf11 = await sharp(src11).resize(1200, 1200).webp({ quality: 82 }).toBuffer();

    const src34 = path.join(root, 'public/images/staging', `percale-${key}-nothrow-3x4.png`);
    const buf34 = fs.existsSync(src34)
      ? await sharp(src34).resize(1200, 1600, { fit: 'inside' }).webp({ quality: 82 }).toBuffer()
      : null;

    for (const size of sizes) {
      const dir = `PERCALE-${color}-${size}`;
      for (const [name, buf, tag] of [['1.webp', buf11, '1'], ['1-3x4.webp', buf34, '34']]) {
        if (!buf) continue;
        const rel = path.join('images/products', dir, name);
        const pubPath = path.join(root, 'public', rel);
        const outPath = path.join(root, 'out', rel);
        if (fs.existsSync(pubPath)) {
          const bak = path.join(backupDir, `${dir}-${name.replace('.webp', '')}-v2-backup.webp`);
          if (!fs.existsSync(bak)) fs.copyFileSync(pubPath, bak);
        }
        fs.writeFileSync(pubPath, buf);
        if (fs.existsSync(path.dirname(outPath))) fs.writeFileSync(outPath, buf);
        console.log(`replaced (${tag}):`, rel);
      }
    }
  }
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
