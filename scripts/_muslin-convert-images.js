// 一次性脚本：1688-1025015219200 Cotton Blend Muslin 双层纱四件套图片转换
// 3 张 1440x1920 (3:4) 源图 → public/images/products/1688-1025015219200-C{1,2,3}/1.webp（q82，与 sync-materials 口径一致）
// 另从 grey 源图裁一张 1600x1200 (4:3) 面料特写 → public/images/fabric-guide/fabric-cotton-blend.webp（面料 PLP hero 用）
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/12021/Desktop/种草图';
const JOBS = [
  { src: 'muslin-grey-3x4.jpg', dir: '1688-1025015219200-C1' },
  { src: 'muslin-navy-3x4.jpg', dir: '1688-1025015219200-C2' },
  { src: 'muslin-brown-3x4.jpg', dir: '1688-1025015219200-C3' },
];

(async () => {
  for (const j of JOBS) {
    const srcPath = path.join(SRC, j.src);
    const outDir = path.join('public/images/products', j.dir);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, '1.webp');
    const meta = await sharp(srcPath).metadata();
    if (meta.width !== 1440 || meta.height !== 1920) {
      throw new Error(`${j.src} 尺寸异常: ${meta.width}x${meta.height}（预期 1440x1920）`);
    }
    await sharp(srcPath).webp({ quality: 82 }).toFile(outPath);
    const om = await sharp(outPath).metadata();
    const size = fs.statSync(outPath).size;
    console.log(`OK ${outPath}: ${om.width}x${om.height} ${om.format} ${(size / 1024).toFixed(0)}KB`);
    if (om.width !== 1440 || om.height !== 1920) throw new Error('产物尺寸不符');
  }
  // 面料特写 hero：1440x1920 → 居中裁 1440x1080 (4:3) → 1600x1200（与 fabric-percale.webp 同规格）
  const heroOut = 'public/images/fabric-guide/fabric-cotton-blend.webp';
  await sharp(path.join(SRC, 'muslin-grey-3x4.jpg'))
    .extract({ left: 0, top: Math.round((1920 - 1080) / 2), width: 1440, height: 1080 })
    .resize(1600, 1200)
    .webp({ quality: 82 })
    .toFile(heroOut);
  const hm = await sharp(heroOut).metadata();
  console.log(`OK ${heroOut}: ${hm.width}x${hm.height} ${hm.format} ${(fs.statSync(heroOut).size / 1024).toFixed(0)}KB`);
})().catch((e) => { console.error(e); process.exit(1); });
