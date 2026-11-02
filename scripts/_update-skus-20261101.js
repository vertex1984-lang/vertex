/**
 * _update-skus-20261101.js — 一次性：按用户 xlsx「新sku」列更新 materials-map.ts 的 sku 字段（2026-11-01）
 * - 显式映射：mk 四款 / percalejac-rose / percalepatch-stone / percalestripe-petal / percalecheck-sand /
 *   pompom4 24 款 / veljac / velstripe 3 款 / washjac-cream
 * - 随机 US-XXXXXX（数字+字母）：duvset-beanred ×4、percale 六色 ×4 尺寸、sateen4 五色 ×4 尺寸 + cream ×3（51 款）
 * 同时把随机 SKU 写出到 scripts/_shots/random-skus-20261101.json 供回填 xlsx。
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.join(__dirname, '..');

const EXPLICIT = {
  'mk-btfly4-mocha-queen': '991242341545-c1',
  'mk-floral4-grey-queen': '991242341545-c2',
  'mk-heart4-tan-queen': '991242341545-c3',
  'mk-print4-blue-queen': '991242341545-c4',
  'percalejac-rose-queen': '975921009077-c2',
  'percalepatch-stone-queen': '975921009077-c3',
  'percalestripe-petal-queen': '975921009077-c4',
  'percalecheck-sand-queen': '1000548719212-C1',
  'pompom4-blush-twin': '996864717089-c1',
  'pompom4-blush-full': '996864717089-c2',
  'pompom4-blush-queen': '996864717089-c3',
  'pompom4-blush-king': '996864717089-c4',
  'pompom4-swirl-twin': '996864717089-c5',
  'pompom4-swirl-full': '996864717089-c6',
  'pompom4-swirl-queen': '996864717089-c7',
  'pompom4-swirl-king': '996864717089-c8',
  'pompom4-leaf-twin': '996864717089-c9',
  'pompom4-leaf-full': '996864717089-c10',
  'pompom4-leaf-queen': '996864717089-c11',
  'pompom4-leaf-king': '996864717089-c12',
  'pompom4-damask-twin': '996864717089-c13',
  'pompom4-damask-full': '996864717089-c14',
  'pompom4-damask-queen': '996864717089-c15',
  'pompom4-damask-king': '996864717089-c16',
  'pompom4-ink-twin': '996864717089-c17',
  'pompom4-ink-full': '996864717089-c18',
  'pompom4-ink-queen': '996864717089-c19',
  'pompom4-ink-king': '996864717089-c20',
  'pompom4-bloom-twin': '996864717089-c21',
  'pompom4-bloom-full': '996864717089-c22',
  'pompom4-bloom-queen': '996864717089-c23',
  'pompom4-bloom-king': '996864717089-c24',
  'veljac-ivory-queen': '1084965959943-C1',
  'velstripe-charcoal-queen': '984351386931-C1',
  'velstripe-denim-queen': '984351386931-C2',
  'velstripe-mocha-queen': '984351386931-C3',
  'washjac-cream-queen': '1047846553177-c1',
};

const RANDOM_TARGETS = [
  ...['twin', 'full', 'queen', 'king'].map((s) => `duvset-beanred-${s}`),
  ...['coconut', 'euca', 'lavender', 'mist', 'nude', 'sky'].flatMap((c) =>
    ['twin', 'full', 'queen', 'king'].map((s) => `percale-${c}-${s}`)
  ),
  ...['cream-twin', 'cream-full', 'cream-king'].map((x) => `sateen4-${x}`),
  ...['beige', 'mustard', 'olive', 'taupe', 'terracotta'].flatMap((c) =>
    ['twin', 'full', 'queen', 'king'].map((s) => `sateen4-${c}-${s}`)
  ),
];

const mmPath = path.join(ROOT, 'src/data/materials-map.ts');
const smPath = path.join(ROOT, 'src/data/shopify-map.ts');
let src = fs.readFileSync(mmPath, 'utf-8');

// 收集既有 US- 码避免碰撞
const used = new Set();
for (const f of [src, fs.existsSync(smPath) ? fs.readFileSync(smPath, 'utf-8') : '']) {
  for (const m of f.matchAll(/US-[A-Z0-9]{6}/g)) used.add(m[0]);
}
const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'; // 去掉易混淆 I/O
function genSku() {
  for (;;) {
    let s = 'US-';
    for (let i = 0; i < 6; i++) s += ALPH[crypto.randomInt(ALPH.length)];
    if (!used.has(s)) { used.add(s); return s; }
  }
}

const randomMap = {};
for (const a of RANDOM_TARGETS) randomMap[a] = genSku();

const ALL = { ...EXPLICIT, ...randomMap };
let updated = 0;
const missing = [];
for (const [asin, sku] of Object.entries(ALL)) {
  // 条目为单行：  "asin": {"title":...,"sku":"...",...},
  const re = new RegExp(`(^\\s*"${asin}":\\s*\\{.*?"sku":")(?:[^"\\\\]|\\\\.)*(")`, 'm');
  if (!re.test(src)) { missing.push(asin); continue; }
  src = src.replace(re, `$1${sku}$2`);
  updated++;
}
fs.writeFileSync(mmPath, src);
fs.writeFileSync(
  path.join(ROOT, 'scripts/_shots/random-skus-20261101.json'),
  JSON.stringify(randomMap, null, 2)
);
console.log(`更新 ${updated} 个 SKU（显式 ${Object.keys(EXPLICIT).length} + 随机 ${RANDOM_TARGETS.length}）`);
if (missing.length) console.log('未找到条目:', missing.join(', '));
