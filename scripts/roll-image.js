// 垂直滚动拼接试验：把顶部灰色带切下来拼到底部，让产品在垂直方向更居中（不缩放、不变形）
// 用法: node scripts/tmp-roll-image.js <in.webp> <out.webp> [shiftPx]
const sharp = require('sharp');

(async () => {
  const [inFile, outFile, shiftArg] = process.argv.slice(2);
  const shift = parseInt(shiftArg || '160', 10);
  const meta = await sharp(inFile).metadata();
  const W = meta.width, H = meta.height;
  const topStrip = await sharp(inFile).extract({ left: 0, top: 0, width: W, height: shift }).toBuffer();
  const lower = await sharp(inFile).extract({ left: 0, top: shift, width: W, height: H - shift }).toBuffer();
  await sharp({ create: { width: W, height: H, channels: 3, background: '#ffffff' } })
    .composite([
      { input: lower, left: 0, top: 0 },
      { input: topStrip, left: 0, top: H - shift },
    ])
    .webp({ quality: 84 })
    .toFile(outFile);
  console.log('rolled', shift, 'px ->', outFile);
})().catch((e) => { console.error(e); process.exit(1); });
