// 被套叠放图：产品上移 + 画面饱满（从原图裁中间偏上区域再放大回 1200）
// 用法: node scripts/crop-duvet-folded.js <file.webp> [...]
// 每个传入路径就地覆盖；调用方负责同时传 staging 与 products 两处路径
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const EXTRACT = { left: 140, top: 140, width: 1060, height: 1060 }; // 1200 原图，产品约放大 13%，中心上移到 ~61%

async function processOne(file) {
  const tmp = file.replace(/\.webp$/i, '.crop-tmp.webp');
  const buf = await sharp(file)
    .extract(EXTRACT)
    .resize(1200, 1200)
    .webp({ quality: 84 })
    .toBuffer();
  // 目标文件可能被 dev server 占用无法直接覆写，先写临时文件，由 shell rm+mv 替换
  fs.writeFileSync(tmp, buf);
  console.log('done:', path.basename(file));
}

(async () => {
  const files = process.argv.slice(2);
  if (!files.length) { console.error('no files'); process.exit(1); }
  for (const f of files) {
    await processOne(f);
  }
})().catch((e) => { console.error(e); process.exit(1); });
