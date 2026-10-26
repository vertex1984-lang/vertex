// 一次性脚本（续）：_strip-1688-prefix.js 后半段——构建/维护脚本同步（支持 \n / \r\n 两种行尾锚点）
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const RE = /1688-(?=\d)/g;

function patch(rel, pairs) {
  const f = path.join(ROOT, rel);
  let s = fs.readFileSync(f, 'utf8');
  for (const [a, b] of pairs) {
    const aCrlf = a.split('\n').join('\r\n');
    const bCrlf = b.split('\n').join('\r\n');
    if (s.includes(a)) s = s.split(a).join(b);
    else if (s.includes(aCrlf)) s = s.split(aCrlf).join(bCrlf);
    else throw new Error(`anchor not found in ${rel}: ${a.slice(0, 60)}`);
  }
  fs.writeFileSync(f, s);
  console.log('PATCH:', rel);
}

// build-shopify-map.js：Shopify 侧 tag/sku 仍是 1688- 旧标识 → 出口归一化去前缀；正则两种形态都收
patch('scripts/build-shopify-map.js', [
  ["// 产品标识：亚马逊 ASIN（B0xxxxxxxx）、1688 供应商标识（1688-xxxx(-Cx)）、自有品牌标识（MK-xxx，2026-10-08 起，如 MK-PC-CORD-OLIVE）\nconst ASIN_RE = /^(B0[A-Z0-9]{8}|1688-[0-9]+(-C[0-9]+)?|MK-[A-Z0-9-]+)$/i;",
   "// 产品标识：亚马逊 ASIN（B0xxxxxxxx）、纯数字供应商标识（2026-10-26 起站内去 1688- 前缀；Shopify 侧 tag/sku 仍为旧 1688- 形态，正则两种都收、出口统一去前缀）、自有品牌标识（MK-xxx）\nconst ASIN_RE = /^(B0[A-Z0-9]{8}|(1688-)?[0-9]+(-C[0-9]+)?|MK-[A-Z0-9-]+)$/i;\nconst strip1688 = (s) => s.toLowerCase().replace(/^1688-/, '');"],
  ['const asinLower = (asinTag || (skuIsAsin ? shopSkuRaw : skuFallbackAsin)).toLowerCase();',
   'const asinLower = strip1688(asinTag || (skuIsAsin ? shopSkuRaw : skuFallbackAsin));'],
  ['? (materialsSkuToAsin[shopSkuRaw.toLowerCase()] || null)',
   '? (materialsSkuToAsin[shopSkuRaw.toLowerCase()] || materialsSkuToAsin[strip1688(shopSkuRaw)] || null)'],
  ["const shopSku = (variant.sku || '').trim().toLowerCase();",
   "const shopSku = strip1688((variant.sku || '').trim());"],
]);

// sync-materials.js：素材库 asin 仍带 1688- 前缀 → 入口归一化
patch('scripts/sync-materials.js', [
  ["  console.log(`素材库 makimoohome 分组产品数: ${items.length}${MATERIALS_JWT ? '（管理端全量）' : ''}`);",
   "  console.log(`素材库 makimoohome 分组产品数: ${items.length}${MATERIALS_JWT ? '（管理端全量）' : ''}`);\n  // 2026-10-26 用户定：站内标识统一去 1688- 前缀；素材库 asin 在入口归一化（manifest 旧 key 失效 → 下次同步全量重下一次，安全方向）\n  items = items.map((i) => ({ ...i, asin: String(i.asin).replace(/^1688-/i, '') }));"],
  ['// 2. 站点现有 ASIN（含 1688-xxx 供应商标识）', '// 2. 站点现有 ASIN（含纯数字供应商标识）'],
]);

// check-cn-titles.js / probe-weights.js：标识正则两种形态都收
patch('scripts/check-cn-titles.js', [
  ['(b0[a-z0-9]+|1688-[a-z0-9-]+)', '(b0[a-z0-9]+|(1688-)?[0-9][a-z0-9-]*)'],
]);
patch('scripts/probe-weights.js', [
  ['/^(B0[A-Z0-9]{8}|1688-[0-9]+(-C[0-9]+)?)$/i', '/^(B0[A-Z0-9]{8}|(1688-)?[0-9]+(-C[0-9]+)?)$/i'],
]);

// build-variant-thumbs.js / sync-materials.js 的硬编码标识符字面量（HIDDEN_ASINS、SOURCES key）：同规则字面替换
for (const rel of ['scripts/build-variant-thumbs.js', 'scripts/sync-materials.js']) {
  const f = path.join(ROOT, rel);
  const s = fs.readFileSync(f, 'utf8');
  const n = (s.match(RE) || []).length;
  if (n) { fs.writeFileSync(f, s.replace(RE, '')); console.log(`OK: ${rel} 字面替换 ${n} 处`); }
}
console.log('SCRIPTS PATCH DONE');
