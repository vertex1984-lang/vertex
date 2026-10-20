/**
 * crop-duvet-mains.js — /bedding/duvet-covers/ 分类主图放大占图比（2026-10-17 用户定，仅限 1.webp 主图）
 * 原理：背景为近均匀棚拍灰底——取四边中位色为背景色，计算每像素与背景的明度差，
 * 缩略图上做阈值 + 行列投影找主体包围盒（含底部接触阴影），
 * 按目标占比（主体宽 ≈ 画面 88%）裁剪，再用背景色扩展回正方形，resize 1200。
 * 原图备份到 scripts/image-backup/<DIR>-1-precrop.webp（已存在则跳过备份）。
 * 用法: node scripts/crop-duvet-mains.js [目录名过滤 ...]（不传 = 全部 *-DUVET）
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PRODUCTS = path.join(__dirname, '..', 'public', 'images', 'products');
const BACKUP = path.join(__dirname, 'image-backup');
const OUT_DIR = path.join(__dirname, '..', 'out', 'images', 'products');
const TARGET_RATIO = 0.88; // 主体宽占画面比例
const FINAL = 1200;

async function subjectBox(file) {
  // 缩略图足够定位主体，速度快且天然去噪
  const W = 240;
  const { data, info } = await sharp(file)
    .resize(W, W, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const lum = (i) => 0.299 * data[i * 3] + 0.587 * data[i * 3 + 1] + 0.114 * data[i * 3 + 2];
  // 背景亮度 = 四边像素中位数
  const border = [];
  for (let x = 0; x < w; x++) { border.push(lum(x)); border.push(lum((h - 1) * w + x)); }
  for (let y = 0; y < h; y++) { border.push(lum(y * w)); border.push(lum(y * w + w - 1)); }
  border.sort((a, b) => a - b);
  const bg = border[Math.floor(border.length / 2)];
  // 行列投影：与背景亮度差超阈值即视为主体
  const TH = 14;
  const colHit = new Array(w).fill(0), rowHit = new Array(h).fill(0);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (Math.abs(lum(y * w + x) - bg) > TH) { colHit[x]++; rowHit[y]++; }
    }
  }
  // 行/列命中数超过该方向长度 2% 才算有效，滤掉零星噪点
  const cMin = h * 0.02, rMin = w * 0.02;
  let x0 = w, x1 = -1, y0 = h, y1 = -1;
  for (let x = 0; x < w; x++) if (colHit[x] > cMin) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  for (let y = 0; y < h; y++) if (rowHit[y] > rMin) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  if (x1 < 0) return null;
  return { x0: x0 / w, y0: y0 / h, x1: (x1 + 1) / w, y1: (y1 + 1) / h };
}

async function bgColor(file) {
  const stats = await sharp(file).extract({ left: 0, top: 0, width: 60, height: 60 }).stats();
  const [r, g, b] = stats.channels.map((c) => Math.round(c.mean));
  return { r, g, b };
}

async function processOne(dir) {
  const file = path.join(PRODUCTS, dir, '1.webp');
  if (!fs.existsSync(file)) { console.log(`跳过 ${dir}：无 1.webp`); return; }
  const srcBuf = fs.readFileSync(file); // Windows：sharp 不能覆写自己正在读的文件，先读进内存
  const meta = await sharp(srcBuf).metadata();
  const W0 = meta.width, H0 = meta.height;
  const box = await subjectBox(srcBuf);
  if (!box) { console.log(`跳过 ${dir}：主体检测失败`); return; }
  // 主体像素框（原图坐标）
  const sx0 = box.x0 * W0, sx1 = box.x1 * W0, sy0 = box.y0 * H0, sy1 = box.y1 * H0;
  const subW = sx1 - sx0, subH = sy1 - sy0;
  // 目标：主体宽占裁剪窗 88%；窗口边长取宽高中更大的需求，保持正方形
  const win = Math.max(subW / TARGET_RATIO, subH / TARGET_RATIO);
  const cx = (sx0 + sx1) / 2, cy = (sy0 + sy1) / 2;
  let l = Math.round(cx - win / 2), t = Math.round(cy - win / 2), s = Math.round(win);
  // 裁剪窗与图交集，不足部分用背景色扩展
  const cl = Math.max(0, l), ct = Math.max(0, t);
  const cr = Math.min(W0, l + s), cb = Math.min(H0, t + s);
  const bg = await bgColor(srcBuf);
  let img = sharp(srcBuf).extract({ left: cl, top: ct, width: cr - cl, height: cb - ct });
  const padL = cl - l, padT = ct - t, padR = l + s - cr, padB = t + s - cb;
  img = img.extend({ left: padL, top: padT, right: padR, bottom: padB, background: bg });
  const buf = await img.resize(FINAL, FINAL).webp({ quality: 85 }).toBuffer();
  // 备份 + 覆盖（public 与 out 同步）
  fs.mkdirSync(BACKUP, { recursive: true });
  const bak = path.join(BACKUP, `${dir}-1-precrop.webp`);
  if (!fs.existsSync(bak)) fs.copyFileSync(file, bak);
  fs.writeFileSync(file, buf);
  const outFile = path.join(OUT_DIR, dir, '1.webp');
  if (fs.existsSync(path.dirname(outFile))) fs.writeFileSync(outFile, buf);
  console.log(`OK ${dir}: 主体 ${(subW / W0 * 100).toFixed(0)}% → ${(subW / win * 100).toFixed(0)}%（窗 ${s}px）`);
}

(async () => {
  const filters = process.argv.slice(2);
  const dirs = fs.readdirSync(PRODUCTS).filter(
    (d) => d.endsWith('-DUVET') && fs.statSync(path.join(PRODUCTS, d)).isDirectory() &&
      (!filters.length || filters.includes(d))
  );
  console.log(`处理 ${dirs.length} 个 DUVET 主图`);
  for (const d of dirs) await processOne(d);
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e.message); process.exit(1); });
