/**
 * swap-fur-throw-main-images.js — 仿兔毛绒毯家族 1688-969627065032 换 PDP 主图（2026-10-19 用户定，幂等）
 * 模式同 KNITTHROW 换图（add-throw-3-series.js 第 0 段）：
 *   每个 ASIN 目录现有 1..N.webp 全部后移 +2（1→3, 2→4, ...），
 *   staging 灰底新图（1728x2304 PNG）转 webp 1200x1600：折叠版=1.webp、平铺版=2.webp（同色跨尺寸共用）
 * 范围：组内全部 23 个 ASIN（Blue C21-25 / Cream Yellow C26-30 / Dark Gray C31-35 /
 *   Silver Gray C36-40 / Purple C41-43；含 230x250 的 C25/C30/C35/C40）
 * 数据更新：
 *   materials-map.ts 每个 asin 小写键 images → [1..N+2].webp（数字顺序），
 *     whiteBg → [false, false, ...原数组]（原条目保持原顺序后移）
 *   image-aspect-overrides.ts → 19 个 asin 加 '3/4'
 * 用法: node scripts/swap-fur-throw-main-images.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const BASE = '1688-969627065032';
const GROUPS = [
  { key: 'fur-blue',       asins: ['C21', 'C22', 'C23', 'C24', 'C25'] },
  { key: 'fur-creamyellow', asins: ['C26', 'C27', 'C28', 'C29', 'C30'] },
  { key: 'fur-darkgray',   asins: ['C31', 'C32', 'C33', 'C34', 'C35'] },
  { key: 'fur-silvergray', asins: ['C36', 'C37', 'C38', 'C39', 'C40'] },
  { key: 'fur-purple',     asins: ['C41', 'C42', 'C43'] },
];

async function convert(src, out) {
  const sharp = require('sharp');
  const tmp = out + '.tmp';
  await sharp(src).resize(1200, 1600).webp({ quality: 82 }).toFile(tmp);
  fs.renameSync(tmp, out);
}

(async () => {
  // 预检源图
  for (const g of GROUPS) {
    for (const kind of ['3x4', 'flat-3x4']) {
      const src = path.join(ROOT, 'public/images/staging', `throw-graybg-${g.key}-${kind}.png`);
      if (!fs.existsSync(src)) { console.error(`缺源图: ${src}`); process.exit(1); }
    }
  }

  const mapFile = path.join(ROOT, 'src/data/materials-map.ts');
  let mapSrc = fs.readFileSync(mapFile, 'utf8');
  const mapLines = mapSrc.split('\n');

  const report = [];
  let skipped = 0;

  for (const g of GROUPS) {
    const folded = path.join(ROOT, 'public/images/staging', `throw-graybg-${g.key}-3x4.png`);
    const flat = path.join(ROOT, 'public/images/staging', `throw-graybg-${g.key}-flat-3x4.png`);
    // 每色只转一次，跨尺寸复制
    const cacheDir = path.join(ROOT, 'public/images/staging', '.fur-cache');
    fs.mkdirSync(cacheDir, { recursive: true });
    const cFolded = path.join(cacheDir, `${g.key}-1.webp`);
    const cFlat = path.join(cacheDir, `${g.key}-2.webp`);
    if (!fs.existsSync(cFolded)) await convert(folded, cFolded);
    if (!fs.existsSync(cFlat)) await convert(flat, cFlat);

    for (const suffix of g.asins) {
      const asin = `${BASE}-${suffix}`;
      const asinLower = asin.toLowerCase();
      const dir = path.join(ROOT, 'public/images/products', asin);
      if (!fs.existsSync(dir)) { console.error(`缺目录: ${dir}`); process.exit(1); }
      const nums = fs.readdirSync(dir)
        .map((f) => /^(\d+)\.webp$/.exec(f))
        .filter(Boolean)
        .map((m) => parseInt(m[1], 10))
        .sort((a, b) => a - b);

      // 幂等判断：materials-map 条目已是 [1,2,...] 且数量与磁盘一致 → 已换过
      const li = mapLines.findIndex((l) => l.includes(`"${asinLower}":`));
      if (li < 0) { console.error(`materials-map.ts 缺 "${asinLower}":`); process.exit(1); }
      const imgMatch = mapLines[li].match(/"images":\[([^\]]*)\]/);
      const curImgs = imgMatch ? imgMatch[1].split(',').map((x) => x.trim().replace(/"/g, '')) : [];
      if (
        curImgs.length === nums.length &&
        curImgs[0] === `/images/products/${asin}/1.webp` &&
        curImgs[1] === `/images/products/${asin}/2.webp`
      ) { skipped++; continue; }

      const oldN = nums.length;
      // 1) 现有图全部后移 +2（先改临时名避免覆盖）
      for (const n of [...nums].sort((a, b) => b - a)) {
        fs.renameSync(path.join(dir, `${n}.webp`), path.join(dir, `${n}.webp.shift`));
      }
      for (const n of nums) {
        fs.renameSync(path.join(dir, `${n}.webp.shift`), path.join(dir, `${n + 2}.webp`));
      }
      // 2) 新图存 1/2.webp
      fs.copyFileSync(cFolded, path.join(dir, '1.webp'));
      fs.copyFileSync(cFlat, path.join(dir, '2.webp'));

      // 3) materials-map：images = 1..N+2 数字顺序；whiteBg 前插两个 false，原数组保持原顺序
      const newImgs = Array.from({ length: oldN + 2 }, (_, i) => `/images/products/${asin}/${i + 1}.webp`);
      const wbMatch = mapLines[li].match(/"whiteBg":\[([^\]]*)\]/);
      const oldWb = wbMatch && wbMatch[1].trim() ? wbMatch[1].split(',').map((x) => x.trim()) : [];
      const newWb = ['false', 'false', ...oldWb];
      mapLines[li] = mapLines[li]
        .replace(/"images":\[[^\]]*\]/, `"images":${JSON.stringify(newImgs)}`)
        .replace(/"whiteBg":\[[^\]]*\]/, `"whiteBg":[${newWb.join(',')}]`);
      report.push(`${asin}: ${oldN} → ${oldN + 2} 张`);
    }
  }

  fs.writeFileSync(mapFile, mapLines.join('\n'), 'utf8');
  report.forEach((r) => console.log(r));
  console.log(`materials-map.ts: ${report.length} 个 asin 已更新（跳过已换 ${skipped}）`);

  // 4) image-aspect-overrides.ts：19 个 asin 加 '3/4'
  {
    const file = path.join(ROOT, 'src/data/image-aspect-overrides.ts');
    let s = fs.readFileSync(file, 'utf8');
    const lines = [];
    for (const g of GROUPS) {
      for (const suffix of g.asins) {
        const a = `${BASE}-${suffix}`.toLowerCase();
        if (s.includes(`'${a}':`)) continue;
        lines.push(`  '${a}': '3/4',`);
      }
    }
    if (lines.length) {
      const idx = s.lastIndexOf('};');
      if (idx < 0) { console.error('image-aspect-overrides.ts anchor not found'); process.exit(1); }
      s = s.slice(0, idx) + lines.join('\n') + '\n' + s.slice(idx);
      fs.writeFileSync(file, s, 'utf8');
    }
    console.log(`image-aspect-overrides.ts: +${lines.length} entries`);
  }
  console.log('全部完成');
})().catch((e) => { console.error('失败:', e); process.exit(1); });
