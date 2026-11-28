// 2026-11-27 三款四件套图片入库（一次性脚本，跑完可删）：
// 产品2 Scarlet Toile：7 图，主图=用户指定的 3239（平视整套），随后整套→细节→面料特写
// 产品3 Champagne Cream / 产品4 Cherry Bloom：各 1 图（俯视整套，唯一图源即主图）
// 源 PNG 均 1344x1792（3:4，免裁切）→ public/images/products/<ASIN>/{n}.webp（q82），Q/K 双份。
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/12021/Desktop/网站产品图';
const OUT_BASE = path.join(__dirname, '..', 'public', 'images', 'products');

const JOBS = [
  {
    dir: '产品2',
    files: [
      ['微信图片_20261120200716_3239_24.png', '1.webp'], // 主图（用户指定）
      ['微信图片_20261120200716_3240_24.png', '2.webp'], // 正面整套
      ['微信图片_20261120200716_3238_24.png', '3.webp'], // 正面整套另一机位
      ['微信图片_20261120200716_3237_24.png', '4.webp'], // 侧景整套
      ['微信图片_20261120200716_3241_24.png', '5.webp'], // 床头/被面细节
      ['微信图片_20261120200716_3242_24.png', '6.webp'], // 面料特写
      ['微信图片_20261120200716_3244_24.png', '7.webp'], // 面料特写另一构图
    ],
    asins: ['MK-TOILE4-SCARLET-QUEEN', 'MK-TOILE4-SCARLET-KING'],
  },
  {
    dir: '产品3',
    files: [['微信图片_20261120002809_3183_24.png', '1.webp']],
    asins: ['MK-CHAMP4-CREAM-QUEEN', 'MK-CHAMP4-CREAM-KING'],
  },
  {
    dir: '产品4',
    files: [['微信图片_20261118182544_2877_24.png', '1.webp']],
    asins: ['MK-CHERRY4-BLOOM-QUEEN', 'MK-CHERRY4-BLOOM-KING'],
  },
];

(async () => {
  for (const job of JOBS) {
    for (const asin of job.asins) {
      const outDir = path.join(OUT_BASE, asin);
      fs.mkdirSync(outDir, { recursive: true });
      for (const [src, out] of job.files) {
        const srcPath = path.join(SRC, job.dir, src);
        const meta = await sharp(srcPath).metadata();
        if (meta.width !== 1344 || meta.height !== 1792) {
          throw new Error(`${job.dir}/${src} 尺寸 ${meta.width}x${meta.height}，不是 1344x1792`);
        }
        const outPath = path.join(outDir, out);
        await sharp(srcPath).webp({ quality: 82 }).toFile(outPath);
        console.log(`${asin}/${out}  ${fs.statSync(outPath).size} bytes`);
      }
    }
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
