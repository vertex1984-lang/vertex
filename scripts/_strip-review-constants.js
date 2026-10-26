const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const f = path.join(ROOT, 'src/data/product-reviews.ts');
let s = fs.readFileSync(f, 'utf8');
const arch = path.join(ROOT, 'archive/removed-products/2026-10-26/data/product-reviews.constants.ts');
for (const n of ['TOWEL_BATH_OVERSIZED', 'ICE_SILK_DUVET', 'ICE_DUVET_COVERS', 'EGG_CASE_PILLOWS', 'BODY_PILLOW_REVIEWS']) {
  const re = new RegExp('\\r?\\nconst ' + n + ': ProductReview\\[\\] = \\[[\\s\\S]*?\\r?\\n\\];');
  const m = s.match(re);
  if (!m) { console.error(n + ' 未匹配'); process.exit(1); }
  fs.appendFileSync(arch, m[0] + '\n');
  s = s.replace(re, '');
  console.log(n + ' 移除并归档');
}
fs.writeFileSync(f, s, 'utf8');
console.log('done');
