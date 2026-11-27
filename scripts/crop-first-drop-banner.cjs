// 一次性素材脚本（2026-11-26 v2）：seedream 生成图 first-drop-hero-gen-1.jpg → 预售区横幅最终素材
// 桌面：原图 2688x1040 ≈ 2.6:1 直接转 webp；移动：床体为中心裁 4/3.97 近方图
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '../public/images/staging/first-drop-hero-gen-1.jpg');
const OUT_DIR = path.join(__dirname, '../public/images/brand');

async function main() {
  await sharp(SRC)
    .webp({ quality: 82 })
    .toFile(path.join(OUT_DIR, 'first-drop-desktop.webp'));

  // 移动：4/3.97 ≈ 1.0076，从床体区域（画面右 2/3）裁 1040 宽近方图
  await sharp(SRC)
    .extract({ left: 1250, top: 0, width: 1040, height: 1032 })
    .resize(1200, 1191)
    .webp({ quality: 82 })
    .toFile(path.join(OUT_DIR, 'first-drop-mobile.webp'));

  console.log('done');
}

main().catch((e) => { console.error(e); process.exit(1); });
