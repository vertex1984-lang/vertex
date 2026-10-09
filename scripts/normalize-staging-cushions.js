/**
 * normalize-staging-cushions.js — 统一 staging 坐垫主图的占图比（2026-10-09）
 * 做法：sharp.trim 识别主体（含底部浅阴影）→ 以主体为中心裁出正方形（四周留白=主体的 14%）→ 缩放到 1200×1200。
 * 背景保持原图像素（灰渐变连续，无接缝）。直接覆盖原文件。
 * 用法: node scripts/normalize-staging-cushions.js [ASIN ...]
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const STAGING = path.join(__dirname, '..', 'public', 'images', 'staging');
const ASINS = process.argv.slice(2).length
  ? process.argv.slice(2).map(s => s.toUpperCase())
  : ['B0CBT7B1TY', 'B0CBT7R7NN', 'B0CBT7RFK2', 'B0CC5WN6JJ', 'B0BCJQYYL1', 'B0CXDZF2WQ'];

const MARGIN_RATIO = 0.0435; // 四周留白 ≈ 主体边长的 4.35%（主体占画面约 92%）
const TRIM_THRESHOLD = 40; // 容忍灰色渐变背景，只保留主体+紧贴阴影

(async () => {
  for (const asin of ASINS) {
    const file = path.join(STAGING, asin, 'main.webp');
    if (!fs.existsSync(file)) { console.log(`${asin}: 跳过（无文件）`); continue; }
    const buf = fs.readFileSync(file);
    const img = sharp(buf);
    const meta = await img.metadata();
    const { data, info } = await sharp(buf).trim({ threshold: TRIM_THRESHOLD }).toBuffer({ resolveWithObject: true });
    const tw = info.width, th = info.height;
    const offL = Math.abs(info.trimOffsetLeft ?? 0), offT = Math.abs(info.trimOffsetTop ?? 0);
    const side = Math.max(tw, th);
    const m = Math.round(side * MARGIN_RATIO);
    let left = offL - m, top = offT - m;
    let crop = side + 2 * m;
    // 钳制在原图范围内
    crop = Math.min(crop, meta.width, meta.height);
    left = Math.min(Math.max(left, 0), meta.width - crop);
    top = Math.min(Math.max(top, 0), meta.height - crop);
    await sharp(buf)
      .extract({ left: Math.round(left), top: Math.round(top), width: Math.round(crop), height: Math.round(crop) })
      .resize(1200, 1200)
      .webp({ quality: 82 })
      .toFile(file + '.tmp');
    fs.copyFileSync(file + '.tmp', file);
    fs.unlinkSync(file + '.tmp');
    console.log(`${asin}: 主体 ${tw}x${th} @(${offL},${offT}) → 裁剪 ${Math.round(crop)}px → 1200x1200`);
  }
  console.log('完成');
})().catch(e => { console.error('失败:', e.message); process.exit(1); });
