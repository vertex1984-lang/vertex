// 一次性脚本：全站移除标识符里的 "1688-" 前缀（2026-10-26 用户定：货源平台信息不出现在 URL 等用户可见处）
// 唯一变换 = 字面 /1688-(?=\d)/ → ''（只匹配"1688-"后紧跟数字的标识符；
// 已排查：src 内所有 1688- 命中均为产品标识符，Shopify CDN URL 内无 1688- 子串，无语义无关命中）
// 范围：src/ 全部文件 + AGENTS.md + public/images/products/1688-* 目录改名 + 构建/维护脚本同步
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RE = /1688-(?=\d)/g;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

// ── 0. 冲突预检（有冲突立即中止，不写任何文件）──
const srcFiles = walk(path.join(ROOT, 'src'));
const strippedTokens = new Set();
for (const f of srcFiles) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/1688-\d[A-Za-z0-9-]*/g)) strippedTokens.add(m[0].slice(5));
}
const conflicts = [];
for (const f of srcFiles) {
  const s = fs.readFileSync(f, 'utf8');
  for (const t of strippedTokens) {
    // 去前缀后的 token 若以"引号字符串/路径段/键"形式已存在（且不是某个 1688- token 的一部分）→ 冲突
    for (const pat of [`"${t}"`, `'${t}'`, `/${t}/`]) {
      const idx = s.indexOf(pat);
      if (idx >= 0 && s.slice(Math.max(0, idx - 6), idx) !== '1688-'.slice(0, 0) && !s.slice(Math.max(0, idx - 5), idx).endsWith('1688-')) {
        // 排除该命中本身就是 '1688-' 前缀 token 的一部分
        conflicts.push(`${path.relative(ROOT, f)}: "${t}" 已存在 (${pat})`);
      }
    }
  }
}
const imgBase = path.join(ROOT, 'public/images/products');
const dirRenames = fs.readdirSync(imgBase).filter((d) => /^1688-\d/.test(d));
for (const d of dirRenames) {
  const target = d.replace(/^1688-/, '');
  if (fs.existsSync(path.join(imgBase, target))) conflicts.push(`图片目录冲突: ${target} 已存在`);
}
if (conflicts.length) {
  console.error('冲突，中止：\n' + conflicts.join('\n'));
  process.exit(1);
}
console.log(`冲突预检通过：${strippedTokens.size} 个去前缀标识符均无既有占用；${dirRenames.length} 个图片目录目标名均空闲`);

// ── 1. src/ 全量字面替换 ──
let totalRepl = 0;
for (const f of srcFiles) {
  const s = fs.readFileSync(f, 'utf8');
  const n = (s.match(RE) || []).length;
  if (!n) continue;
  fs.writeFileSync(f, s.replace(RE, ''));
  totalRepl += n;
  console.log(`OK: ${path.relative(ROOT, f)} (${n})`);
}
// AGENTS.md 同样字面替换 asin 引用（规则行文下面单独改）
{
  const f = path.join(ROOT, 'AGENTS.md');
  const s = fs.readFileSync(f, 'utf8');
  const n = (s.match(RE) || []).length;
  fs.writeFileSync(f, s.replace(RE, ''));
  totalRepl += n;
  console.log(`OK: AGENTS.md (${n})`);
}
console.log(`src/+AGENTS.md 字面替换合计 ${totalRepl} 处`);

// ── 2. 图片目录改名 ──
for (const d of dirRenames) {
  fs.renameSync(path.join(imgBase, d), path.join(imgBase, d.replace(/^1688-/, '')));
}
console.log(`图片目录改名 ${dirRenames.length} 个`);

// ── 3. 非字面替换的定点修正 ──
function patch(rel, pairs) {
  const f = path.join(ROOT, rel);
  let s = fs.readFileSync(f, 'utf8');
  for (const [a, b] of pairs) {
    if (!s.includes(a)) throw new Error(`anchor not found in ${rel}: ${a.slice(0, 60)}`);
    s = s.split(a).join(b);
  }
  fs.writeFileSync(f, s);
  console.log('PATCH:', rel);
}

// bedding-families.ts：setFamilyRoot 的 '1688' 两段兜底已死（标识符不再有 1688 段），简化并更新注释
patch('src/data/bedding-families.ts', [
  [` * 无变体族的兜底用 key 前缀：'duvset-gray' → 'duvset'；二维家族 '1688-xxx::颜色' → '1688-xxx'；\r\n * 1688 纯尺寸家族无颜色段，取前两段避免不同供应商产品线并成一块`,
   ` * 无变体族的兜底用 key 首段：'duvset-gray' → 'duvset'；二维家族 '数字id::颜色' → '数字id'\r\n * （2026-10-26 标识去 1688- 前缀后纯数字供应商家族为单段 id，整段即族根，原"取前两段"逻辑移除）`],
  [`  return parts[0] === '1688' ? parts.slice(0, 2).join('-') : parts[0];`,
   `  return parts[0];`],
  [`  // 无变体族的兜底用 key 前缀：'duvset-gray' → 'duvset'；二维家族 '1688-xxx::颜色' → '1688-xxx'；\r\n  // 1688 纯尺寸家族无颜色段，取前两段避免不同供应商产品线并成一块。`,
   `  // 无变体族的兜底用 key 首段：'duvset-gray' → 'duvset'；二维家族 '数字id::颜色' → '数字id'。`],
]);

// weights-overrides.ts 文件头注释口径
patch('src/data/weights-overrides.ts', [
  ['key = 小写产品标识 asin / 1688-xxx / bedset4-xxx 等', 'key = 小写产品标识 asin（纯数字供应商标识，2026-10-26 起去 1688- 前缀）/ bedset4-xxx 等'],
]);

// AGENTS.md：现行规则行文更新（历史日志行保留）
patch('AGENTS.md', [
  ['亚马逊 ASIN（`B0xxxxxxxx`）或 1688 供应商标识（`1688-xxx` / `1688-xxx-Cx`）',
   '亚马逊 ASIN（`B0xxxxxxxx`）或纯数字供应商标识（`xxxxxxxxxxxx` / `xxxxxxxxxxxx-Cx`；2026-10-26 用户定：全站标识移除 `1688-` 前缀，货源平台信息不出现在 URL 等用户可见处）'],
  ['tags 里恰好打一个产品标识（ASIN 或 1688-xxx）为最优先', 'tags 里恰好打一个产品标识（ASIN 或纯数字标识；Shopify 侧旧 `1688-` tag 由 build-shopify-map.js 归一化）为最优先'],
  ['- 1688 供应商标识的产品无亚马逊链接', '- 纯数字供应商标识（原 1688 系）的产品无亚马逊链接'],
]);

// build-shopify-map.js：Shopify 侧 tag/sku 仍是 1688- 旧标识 → 入口归一化去前缀；正则两种形态都收
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

// sync-materials.js：素材库 asin 仍带 1688- 前缀 → 入口归一化（HIDDEN_ASINS 等字面量走下面的字面替换）
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

// build-variant-thumbs.js / sync-materials.js 的 HIDDEN_ASINS 等硬编码标识符字面量：同规则字面替换
for (const rel of ['scripts/build-variant-thumbs.js', 'scripts/sync-materials.js']) {
  const f = path.join(ROOT, rel);
  const s = fs.readFileSync(f, 'utf8');
  const n = (s.match(RE) || []).length;
  if (n) { fs.writeFileSync(f, s.replace(RE, '')); console.log(`OK: ${rel} 字面替换 ${n} 处`); }
}

// ── 4. JSON 完整性校验 ──
for (const rel of ['src/data/material-overrides.json', 'src/data/product-tags.json', 'src/data/taxonomy.json', 'src/data/weight-boosts.json']) {
  JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
}
console.log('JSON 校验通过');
console.log('STRIP DONE');
