/**
 * _wire-blanket-main-images-20261111.js — 把 staging 的 32 张毯子主图接入 99 个规划毯子产品（幂等）。
 *
 * 规则（用户定）：同一变体组不同尺寸共用同一张主图 → 每色选最大尺寸的 ASIN 目录作宿主
 * （沿用 SATEEN4 / VELSTRIPE 等多尺寸共享 1.webp 的既有约定），
 * public/images/products/<HOST-ASIN>/1.webp，全组 99 个 ASIN 的数据都指向该 URL。
 *
 * 源图：public/images/staging/main-a2b-blanket-<组>-<颜色>.jpg（1536x2048，3:4 竖版）
 * 输出/改动：
 *  1. 32 张 webp(q82) → public/images/products/<HOST-ASIN>/1.webp
 *  2. src/data/materials-map.ts：99 条 planned 条目 images 占位图 → 对应颜色 URL
 *  3. src/data/products-blankets-planned.ts：99 个条目 images[0].url 同步替换
 *  4. src/data/image-aspect-overrides.ts：99 个 ASIN 注册 '3/4'（竖版主图容器适配）
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
sharp.cache({ files: 0 });

const ROOT = path.join(__dirname, '..');
const PLACEHOLDER = '/images/products/_planned/blanket-throw.webp';

/* ========== 1. 由行映射推导 99 个 ASIN → 颜色组 → 宿主 ASIN ========== */
const rows = JSON.parse(fs.readFileSync(path.join(__dirname, '_shots', 'planned-blankets-20261102.json'), 'utf8'));
if (rows.length !== 99) { console.error('行数异常: ' + rows.length); process.exit(1); }

const groups = new Map(); // key = "<prefix>-<colorSlug>"
for (const r of rows) {
  const a = r.asin.toLowerCase();
  const m = a.match(/^([a-z0-9]+)-([a-z]+)-(\d+)x(\d+)$/);
  if (!m) { console.error('asin 解析失败: ' + a); process.exit(1); }
  const [, prefix, color, w, h] = m;
  const key = `${prefix}-${color}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push({ asin: r.asin, asinLower: a, area: (+w) * (+h) });
}
console.log(`颜色组数: ${groups.size}（应为 32）`);
if (groups.size !== 32) { console.error('组数异常'); process.exit(1); }

// 每组宿主 = 面积最大的变体
const hostOf = new Map(); // key -> { hostAsin, url, srcFile }
for (const [key, members] of groups) {
  members.sort((x, y) => y.area - x.area);
  const host = members[0].asin;
  const srcFile = path.join(ROOT, 'public', 'images', 'staging', `main-a2b-blanket-${key}.jpg`);
  if (!fs.existsSync(srcFile)) { console.error('缺源图: ' + srcFile); process.exit(1); }
  hostOf.set(key, { hostAsin: host, url: `/images/products/${host}/1.webp`, srcFile });
}
// asinLower → 目标 URL
const urlByAsin = new Map();
for (const r of rows) {
  const a = r.asin.toLowerCase();
  const key = a.replace(/-\d+x\d+$/, '');
  urlByAsin.set(a, hostOf.get(key).url);
}

(async () => {
  /* ========== 2. 转图：jpg → webp q82 ========== */
  for (const [key, g] of hostOf) {
    const meta = await sharp(g.srcFile).metadata();
    if (meta.width !== 1536 || meta.height !== 2048) {
      console.error(`${key} 尺寸 ${meta.width}x${meta.height}，非 1536x2048`); process.exit(1);
    }
    const outDir = path.join(ROOT, 'public', 'images', 'products', g.hostAsin);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, '1.webp');
    await sharp(g.srcFile).webp({ quality: 82 }).toFile(outPath + '.tmp');
    fs.renameSync(outPath + '.tmp', outPath);
    console.log(`[图] ${key} → ${g.hostAsin}/1.webp (${fs.statSync(outPath).size} bytes)`);
  }

  /* ========== 3. materials-map.ts ========== */
  {
    const file = path.join(ROOT, 'src', 'data', 'materials-map.ts');
    let s = fs.readFileSync(file, 'utf8');
    let n = 0;
    for (const [asinLower, url] of urlByAsin) {
      const re = new RegExp(`("${asinLower}": \\{[^\\n]*?"images":\\[")${PLACEHOLDER.replace(/[/.]/g, '\\$&')}("\\])`);
      if (!re.test(s)) { console.error('materials-map 未命中: ' + asinLower); process.exit(1); }
      s = s.replace(re, `$1${url}$2`);
      n++;
    }
    fs.writeFileSync(file, s, 'utf8');
    console.log(`materials-map.ts: ${n} 条替换`);
  }

  /* ========== 4. products-blankets-planned.ts ========== */
  {
    const file = path.join(ROOT, 'src', 'data', 'products-blankets-planned.ts');
    let s = fs.readFileSync(file, 'utf8');
    let n = 0;
    for (const [asinLower, url] of urlByAsin) {
      const asin = asinLower.toUpperCase();
      const asinIdx = s.indexOf(`"asin": "${asin}"`);
      if (asinIdx < 0) { console.error('planned 未找到 asin: ' + asin); process.exit(1); }
      const imgIdx = s.indexOf(`"url": "${PLACEHOLDER}"`, asinIdx);
      const nextAsin = s.indexOf('"asin": "', asinIdx + 1);
      if (imgIdx < 0 || (nextAsin > 0 && imgIdx > nextAsin)) {
        // 已替换过（幂等重跑）→ 校验现值是否正确
        const curIdx = s.indexOf(`"url": "${url}"`, asinIdx);
        if (curIdx < 0 || (nextAsin > 0 && curIdx > nextAsin)) { console.error('planned 条目异常: ' + asin); process.exit(1); }
        continue;
      }
      s = s.slice(0, imgIdx) + `"url": "${url}"` + s.slice(imgIdx + `"url": "${PLACEHOLDER}"`.length);
      n++;
    }
    fs.writeFileSync(file, s, 'utf8');
    console.log(`products-blankets-planned.ts: ${n} 条替换`);
  }

  /* ========== 5. image-aspect-overrides.ts（99 条 '3/4'，幂等） ========== */
  {
    const file = path.join(ROOT, 'src', 'data', 'image-aspect-overrides.ts');
    let s = fs.readFileSync(file, 'utf8');
    const missing = [...urlByAsin.keys()].filter((a) => !s.includes(`'${a}':`));
    if (missing.length) {
      const lines = missing.map((a) => `  '${a}': '3/4',`).join('\n');
      const block = `\n  // >>> blanket-main-images-20261111 >>> 规划毯子 3:4 竖版主图\n${lines}\n  // <<< blanket-main-images-20261111 <<<\n`;
      const close = s.lastIndexOf('};');
      if (close < 0) { console.error('image-aspect-overrides 锚点未找到'); process.exit(1); }
      s = s.slice(0, close) + block + s.slice(close);
      fs.writeFileSync(file, s, 'utf8');
    }
    console.log(`image-aspect-overrides.ts: 新增 ${missing.length} 条`);
  }

  console.log('全部完成');
})().catch((e) => { console.error('失败:', e); process.exit(1); });
