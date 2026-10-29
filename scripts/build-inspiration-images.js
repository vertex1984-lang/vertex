// 一次性脚本：把 对比/ 文件夹的 16 张场景对比图处理成 1200x1600 webp
// 奇数编号 = before（空房），偶数编号 = after（布置后）
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC = 'C:/Users/12021/Desktop/大片图/对比';
const OUT = path.join(__dirname, '..', 'public', 'images', 'inspiration');

// scene 编号 -> [before文件, after文件]
const scenes = [
  ['微信图片_20261027232752_2179_24.png', '微信图片_20261027232753_2180_24.png'],
  ['微信图片_20261027232753_2181_24.png', '微信图片_20261027232754_2182_24.png'],
  ['微信图片_20261027232755_2183_24.png', '微信图片_20261027232759_2184_24.png'],
  ['微信图片_20261027232800_2185_24.png', '微信图片_20261027232801_2186_24.png'],
  ['微信图片_20261027232802_2187_24.png', '微信图片_20261027232803_2188_24.png'],
  ['微信图片_20261027232804_2189_24.png', '微信图片_20261027232804_2190_24.png'],
  ['微信图片_20261027232806_2191_24.png', '微信图片_20261027232807_2192_24.png'],
  ['微信图片_20261027232810_2193_24.png', '微信图片_20261027232810_2194_24.png'],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (let i = 0; i < scenes.length; i++) {
    const n = i + 1;
    for (const [kind, file] of [['before', scenes[i][0]], ['after', scenes[i][1]]]) {
      const src = path.join(SRC, file);
      const dst = path.join(OUT, `scene-${n}-${kind}.webp`);
      await sharp(src)
        .resize(1200, 1600, { fit: 'cover' })
        .webp({ quality: 82 })
        .toFile(dst);
      const kb = Math.round(fs.statSync(dst).size / 1024);
      console.log(`${dst}  ${kb}KB`);
    }
  }
  console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
