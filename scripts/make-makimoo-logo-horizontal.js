/**
 * make-makimoo-logo-horizontal.js — 把 makimoo 竖版 logo（图标上 + 文字下）重排为横版（图标左 + 文字右）
 * 图标和文字均取自原 logo 原样像素，不重绘、不改字形（2026-10-28 用户定：不要改现有图标）。
 * 输出: public/images/brand/makimoo-logo-horizontal.png（透明底，若原图无 alpha 则白底）
 * 用法: node scripts/make-makimoo-logo-horizontal.js
 */
const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'public', 'images', 'brand', 'makimoo-logo.webp');
const DEST = path.join(__dirname, '..', 'public', 'images', 'brand', 'makimoo-logo-horizontal.png');

(async () => {
  const img = sharp(SRC);
  const meta = await img.metadata();
  console.log(`原图 ${meta.width}x${meta.height}, hasAlpha=${meta.hasAlpha}`);

  // 1) 整体 trim 去掉白边/透明边，拿到内容区（图标 + 文字）
  const { data: trimmedBuf, info: trimmedInfo } = await img
    .trim({ threshold: 10 })
    .png()
    .toBuffer({ resolveWithObject: true });
  const W = trimmedInfo.width, H = trimmedInfo.height;
  console.log(`trim 后内容区 ${W}x${H}`);

  // 2) 扫描每行平均亮度，找图标与文字之间的空白分隔行
  const { data: raw, info: rawInfo } = await sharp(trimmedBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rowInk = new Array(H).fill(0);
  for (let y = 0; y < H; y++) {
    let ink = 0;
    for (let x = 0; x < W; x++) {
      const a = raw[(y * W + x) * 4 + 3];
      if (a > 40) ink++;
    }
    rowInk[y] = ink;
  }
  // 文字区是内容区底部的一段连续非空行；从底部向上找到第一个空行即分隔点
  let splitY = H - 1;
  while (splitY > 0 && rowInk[splitY] === 0) splitY--; // 文字底
  while (splitY > 0 && rowInk[splitY] > 0) splitY--;   // 文字顶之上的空行
  console.log(`分隔行 y=${splitY}（图标 0~${splitY}，文字 ${splitY}~${H}）`);

  // 3) 分别裁出图标和文字并各自 tight trim
  const iconBuf = await sharp(trimmedBuf).extract({ left: 0, top: 0, width: W, height: splitY })
    .trim({ threshold: 10 }).png().toBuffer();
  const textBuf = await sharp(trimmedBuf).extract({ left: 0, top: splitY, width: W, height: H - splitY })
    .trim({ threshold: 10 }).png().toBuffer();
  const iconMeta = await sharp(iconBuf).metadata();
  const textMeta = await sharp(textBuf).metadata();
  console.log(`图标 ${iconMeta.width}x${iconMeta.height}，文字 ${textMeta.width}x${textMeta.height}`);

  // 4) 横版排版：图标左，文字右；文字缩放到图标高度的 60%（字母稍低于图标）
  // makimoo 全小写无下伸部，几何居中会视觉偏低，上移文字高度的 18% 做光学居中
  const iconH = iconMeta.height, iconW = iconMeta.width;
  const textScaleH = Math.round(iconH * 0.60);
  const textScaled = await sharp(textBuf).resize({ height: textScaleH }).png().toBuffer();
  const tsMeta = await sharp(textScaled).metadata();
  const gap = Math.round(iconH * 0.14);   // 图标与文字间距
  const pad = Math.round(iconH * 0.06);   // 四周留白
  const canvasW = pad * 2 + iconW + gap + tsMeta.width;
  const canvasH = pad * 2 + iconH;
  const textTop = pad + Math.round((iconH - textScaleH) / 2) - Math.round(textScaleH * 0.18);

  const background = meta.hasAlpha ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 255, g: 255, b: 255, alpha: 1 };
  await sharp({ create: { width: canvasW, height: canvasH, channels: 4, background } })
    .composite([
      { input: iconBuf, left: pad, top: pad },
      { input: textScaled, left: pad + iconW + gap, top: textTop },
    ])
    .png()
    .toFile(DEST);

  // 5) 重着色为导航文字色 深咖啡 #4A3428（保留 alpha；透明态导航靠 CSS invert 反白不受影响）
  const { data: px, info: pxInfo } = await sharp(DEST).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < px.length; i += 4) { px[i] = 0x4A; px[i + 1] = 0x34; px[i + 2] = 0x28; }
  await sharp(px, { raw: { width: pxInfo.width, height: pxInfo.height, channels: 4 } }).png().toFile(DEST);
  console.log(`已保存 ${DEST} (${canvasW}x${canvasH})，深咖啡 #4A3428`);
})().catch(e => { console.error('失败:', e); process.exit(1); });
