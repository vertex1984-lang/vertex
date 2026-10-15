/**
 * patch-towel-second-image.js — 给 24 个 MK-TOWEL-LSC 产品的图集追加第二张（挂杆种草图 2.webp）
 * 2026-10-16 用户定：种草图放产品图第二张（灰底主图之后）。
 * products.ts（多行 JSON）与 materials-map.ts（单行 JSON）各补一条；幂等，已含 2.webp 跳过。
 * 用法: node scripts/patch-towel-second-image.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const colors = ['CREAM', 'OATMEAL', 'SAGE', 'DUSTYROSE', 'LIGHTGREY', 'DUSTYBLUE'];
const sizes = ['12X12', '20X30', '30X56', '40X70'];
const asins = [];
for (const c of colors) for (const s of sizes) asins.push(`MK-TOWEL-LSC-${c}-${s}`);

// ─── products.ts ────────────────────────────────────────────────────────────
{
  const f = path.join(ROOT, 'src/data/products.ts');
  let s = fs.readFileSync(f, 'utf8');
  let n = 0;
  for (const a of asins) {
    const i = s.indexOf(`"asin": "${a}"`);
    if (i < 0) { console.error('products.ts not found', a); continue; }
    if (s.slice(i, i + 4000).includes('/2.webp')) continue;
    const imgAnchor = `"url": "/images/products/${a}/1.webp"`;
    const j = s.indexOf(imgAnchor, i);
    if (j < 0 || j > i + 4000) { console.error('img anchor fail', a); continue; }
    const closeIdx = s.indexOf('}', j); // 该 image 对象结束
    const altMatch = s.slice(j, closeIdx).match(/"altText": "((?:[^"\\]|\\.)*)"/);
    const alt = altMatch ? altMatch[1] : '';
    const obj =
      ',\r\n        {\r\n          "url": "/images/products/' + a + '/2.webp",' +
      '\r\n          "altText": "' + alt + '",' +
      '\r\n          "width": 1200,\r\n          "height": 1200\r\n        }';
    s = s.slice(0, closeIdx + 1) + obj + s.slice(closeIdx + 1);
    n++;
  }
  fs.writeFileSync(f, s, 'utf8');
  console.log('products.ts patched:', n);
}

// ─── materials-map.ts ───────────────────────────────────────────────────────
{
  const f = path.join(ROOT, 'src/data/materials-map.ts');
  let s = fs.readFileSync(f, 'utf8');
  let n = 0;
  for (const a of asins) {
    const key = `"${a.toLowerCase()}":`;
    const i = s.indexOf(key);
    if (i < 0) { console.error('materials-map not found', key); continue; }
    const lineEnd = s.indexOf('\n', i);
    const line = s.slice(i, lineEnd);
    if (line.includes('/2.webp')) continue;
    const nl = line
      .replace(`/images/products/${a}/1.webp"]`, `/images/products/${a}/1.webp","/images/products/${a}/2.webp"]`)
      .replace('"whiteBg":[false]', '"whiteBg":[false,false]');
    s = s.slice(0, i) + nl + s.slice(lineEnd);
    n++;
  }
  fs.writeFileSync(f, s, 'utf8');
  console.log('materials-map.ts patched:', n);
}
