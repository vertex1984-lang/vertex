/**
 * _create-planned-products-20261101.js — 为 bedding 四类型规划 SKU 创建产品数据（2026-11-01 方案，可重跑幂等）
 *
 * 输入：
 *  - scripts/_shots/bedding-products.json（在架产品快照）+ out/（hasPdp 判定）
 *  - scripts/_shots/tab-new-skus-20261101.json（固化规划 SKU，key = `Tab|famKey|Tier`）
 *  - C:/Users/12021/Desktop/bedding-sku表.xlsx（「Sheets & Duvet Set」tab 的 7 条「规划新增」行；EBUSY = 请先关 Excel）
 *  - C:/Users/12021/Desktop/供应链产品图/{货号}.jpg（7 个规划四件套的产品图）
 *
 * 输出（全部幂等：重跑先移除 `planned-20261101` 标记块再重新生成）：
 *  1. src/data/products-planned.ts（整体重写）——PLANNED_PRODUCTS（price 0.00 / availableForSale false）
 *  2. src/data/materials-map.ts —— 每个新 asin 追加 {title,sku,images} 条目（标记块）
 *  3. src/data/variant-groups.ts —— 新建 面料线×类型 组 + 重建扩展 PERCALE-DUVET / LINEN3-DUVET /
 *     PERCALECHECK / PERCALEPATCH / PERCALESTRIPE / WASHJAC（标记块）
 *  4. src/data/specs-overrides.ts —— 新 asin 的 material/dimensionsCm（标记块）
 *  5. src/data/short-titles.ts —— 新 asin 的短标题（标记块）
 *  6. public/images/products/{ASIN}/1.webp —— 7 个规划四件套的供应链图转 webp
 *
 * 另需手工一次改动（脚本不做）：products.ts 合并 PLANNED_PRODUCTS；bedding-families.ts 家族归类补丁。
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
// Windows 关键：禁用 libvips 输入文件缓存，否则 metadata() 读过的图片会被内存映射占用，
// 同进程后续 writeFileSync 覆盖同路径报 UNKNOWN/Invalid argument
sharp.cache({ files: 0 });
const ExcelJS = require('exceljs');

(async () => {

const ROOT = path.join(__dirname, '..');
const XLSX = 'C:/Users/12021/Desktop/bedding-sku表.xlsx';
const SUPPLY_DIR = 'C:/Users/12021/Desktop/供应链产品图';
const MARK = 'planned-20261101';

/* ================= 站点数据（同 _rebuild-sku-xlsx-20261101.js） ================= */
const DELETED = new Set([
  'bedset4-beige-twin','bedset4-beige-full','bedset4-beige-queen','bedset4-beige-king',
  'bedset4-pink-twin','bedset4-pink-full','bedset4-pink-queen','bedset4-pink-king',
  'pompom4-vine-twin','pompom4-vine-full','pompom4-vine-queen','pompom4-vine-king',
  'percalejac-grey-queen','percalejac-oatbeige-queen',
]);
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/_shots/bedding-products.json'), 'utf8'))
  .filter((p) => !DELETED.has(p.asin.toLowerCase()));

const mmSrc = fs.readFileSync(path.join(ROOT, 'src/data/materials-map.ts'), 'utf8');
const mmMap = {};
{
  const re = /\n  "([^"]+)": \{"title":"/g;
  const keys = [];
  let m;
  while ((m = re.exec(mmSrc))) keys.push({ k: m[1], i: m.index });
  const un = (x) => { try { return JSON.parse('"' + x + '"'); } catch { return x; } };
  for (let j = 0; j < keys.length; j++) {
    const body = mmSrc.slice(keys[j].i, j + 1 < keys.length ? keys[j + 1].i : mmSrc.length);
    const t = body.match(/"title":"((?:\\.|[^"\\])*)"/);
    const s = body.match(/"sku":"((?:\\.|[^"\\])*)"/);
    const im = body.match(/"images":\[([^\]]*)\]/);
    const wb = body.match(/"whiteBg":\[([^\]]*)\]/);
    mmMap[keys[j].k.toLowerCase()] = {
      title: t ? un(t[1]) : '',
      sku: s ? un(s[1]) : '',
      images: im ? [...im[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [],
      whiteBg: wb ? wb[1].split(',').map((x) => x.trim() === 'true') : [],
    };
  }
}

const asinToGroup = {};
{
  const vgSrc = fs.readFileSync(path.join(ROOT, 'src/data/variant-groups.ts'), 'utf8');
  const re = /id:\s*'([^']+)'[\s\S]*?members:\s*\[([\s\S]*?)\n    \]/g;
  let m;
  while ((m = re.exec(vgSrc))) {
    const mre = /\{\s*asin:\s*'([^']+)'([^}]*)\}/g;
    let mm;
    while ((mm = mre.exec(m[2]))) {
      const body = mm[2];
      asinToGroup[mm[1].toLowerCase()] = {
        gid: m[1],
        color: (body.match(/color:\s*'([^']*)'/) || [])[1] || '',
        size: (body.match(/size:\s*'([^']*)'/) || [])[1] || '',
      };
    }
  }
}

/* ================= 分类/家族逻辑（同 rebuild 脚本） ================= */
const SET_SIZE_ORDER = ['TWIN', 'FULL', 'QUEEN', 'KING'];
const DUVET_PREFIXES = ['1048207560416', '1061371343572'];
function classifySet(asin) {
  const a = asin.toLowerCase();
  if (/-duvet$/.test(a)) return 'duvet';
  if (/-sheet$/.test(a)) return 'sheet';
  if (/(^|-)pc(-|$)/.test(a)) return 'pillowcase';
  for (const p of ['bedset4-','sateen4-','pompom4-','percalejac-','percalecheck-','percalestripe-','percalepatch-','washstripe-','washjac-','veljac-','velstripe-','1071466105053','1025015219200','mk-heart4-','mk-print4-','mk-floral4-','mk-btfly4-'])
    if (a.startsWith(p)) return 'four';
  if (a.startsWith('sheetset-')) return 'sheetset';
  if (a.startsWith('duvetset-')) return 'duvetset';
  if (a.startsWith('bundle-')) return 'bundle';
  if (a.startsWith('duvset-') || a.startsWith('linen3-') || a.startsWith('916370884976')) return 'four';
  if (a.startsWith('percale-')) return 'four';
  if (DUVET_PREFIXES.some((p) => a.startsWith(p))) return 'four';
  return null;
}
const COLOR_LABELS = {
  DUSTYBLUE:'Dusty Blue',OFFWHITE:'Off White',BEANRED:'Bean Red',BUTTER:'Butter Yellow',DILL:'Dill Green',OAT:'Alpine Oat',SKY:'Sky Blue',MIST:'Mist Grey',COCONUT:'Coconut Milk',NUDE:'Nude Pink',EUCA:'Eucalyptus',LAVENDER:'Lavender Fog',CREAM:'Cream White',BEIGE:'Soft Beige',MUSTARD:'Mustard Yellow',TAUPE:'Taupe',TERRACOTTA:'Terracotta',OLIVE:'Olive Green',SWIRL:'Caramel Swirl',VINE:'Olive Vine',LEAF:'Dusty Leaf',BLUSH:'Blush Floral',INK:'Ink Floral',BLOOM:'Lilac Bloom',DAMASK:'Gold Damask',HAZE:'Dusty Blue',ROSE:'Dusty Pink',GREY:'Light Grey',OATBEIGE:'Oatmeal Beige',PETAL:'Blush Pink Stripe',STONE:'Stone Grey Patchwork',SAGEGREEN:'Sage Green',GINGHAM:'Grey Gingham',HEART:'Tan Heart',POLKA:'Blue Polka',IVORY:'Ivory White',SAND:'Sand Beige',MOCHA:'Sage Stripe',DENIM:'Denim Stripe',CHARCOAL:'Charcoal Stripe',HEART4:'Tan Heart',PRINT4:'Blue Print',FLORAL4:'Grey Floral',BTFLY4:'Mocha Butterfly',
};
function titleColorOf(asin) {
  const m = (mmMap[asin.toLowerCase()]?.title || '').match(/\(([^()]+)\)\s*$/);
  return m ? m[1].trim() : '';
}
function duvetColorOf(asin) {
  const g = asinToGroup[asin.toLowerCase()];
  return g && g.color ? g.color : titleColorOf(asin);
}
function familyKeyOf(asin) {
  const a = asin.toLowerCase();
  if (a.startsWith('916370884976')) return '916370884976';
  if (a.startsWith('1025015219200')) return `1025015219200::${duvetColorOf(asin)}`;
  if (a.startsWith('1071466105053')) return `1071466105053::${duvetColorOf(asin)}`;
  const dp = DUVET_PREFIXES.find((p) => a.startsWith(p));
  if (dp) return `${dp}::${duvetColorOf(asin)}`;
  const parts = asin.split('-');
  const last = parts[parts.length - 1].toUpperCase();
  return SET_SIZE_ORDER.includes(last) ? parts.slice(0, -1).join('-') : asin;
}
function colorOfKey(key, asin) {
  if (key.includes('::')) return key.split('::')[1];
  if (key === '916370884976') return titleColorOf(asin);
  const code = key.split('-')[1] || '';
  return COLOR_LABELS[code.toUpperCase()] || code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
}
const hasPdp = (p) => fs.existsSync(path.join(ROOT, 'out/products', p.handle, 'index.html'));
const sizeRank = (asin) => { const i = SET_SIZE_ORDER.indexOf(asin.split('-').pop().toUpperCase()); return i === -1 ? 99 : i; };

/* ================= 66 个四件套家族 ================= */
const fourFams = [];
{
  const fams = new Map();
  for (const p of products) {
    if (classifySet(p.asin) !== 'four') continue;
    const key = familyKeyOf(p.asin);
    if (!fams.has(key)) fams.set(key, []);
    fams.get(key).push(p);
  }
  for (const [key, membersAll] of fams) {
    const members = membersAll.filter(hasPdp);
    if (!members.length) continue;
    const sorted = [...members].sort((a, b) => sizeRank(a.asin) - sizeRank(b.asin));
    const rep = sorted.find((p) => p.asin.toUpperCase().endsWith('-QUEEN')) || sorted[0];
    fourFams.push({ key, color: colorOfKey(key, rep.asin), rep, members: sorted });
  }
  fourFams.sort((a, b) => a.rep.asin.localeCompare(b.rep.asin));
}
const famByKey = new Map(fourFams.map((f) => [f.key.toLowerCase(), f]));

/* ================= 面料线元数据 ================= */
const LINES = ['percalestripe','percalecheck','percalepatch','percalejac','washstripe','washjac','velstripe','veljac','mk-heart4','mk-print4','mk-floral4','mk-btfly4','sateen4','pompom4','bedset4','duvset','linen3','percale'];
const LINES_ORDER = ['sateen4','percale','linen3','duvset','bedset4','pompom4','percalejac','percalecheck','percalepatch','percalestripe','washstripe','washjac','veljac','velstripe','mk-heart4','mk-print4','mk-floral4','mk-btfly4','1025015219200','1071466105053'];
const LINE_INFO = {
  'bedset4':       { title: 'Soft Microfiber', slug: 'soft-microfiber', material: 'Microfiber' },
  'duvset':        { title: 'Soft Brushed Microfiber', slug: 'soft-brushed-microfiber', material: 'Washed Cotton-Like' },
  'linen3':        { title: '100% Linen', slug: '100-linen', material: '100% Linen' },
  'percale':       { title: 'Cotton Percale', slug: 'cotton-percale', material: 'Cotton Percale' },
  'sateen4':       { title: 'Cotton Sateen', slug: 'cotton-sateen', material: 'Cotton Sateen' },
  'pompom4':       { title: 'Embossed Velvet', slug: 'embossed-velvet-pom-pom', material: 'Embossed Velvet' },
  'percalejac':    { title: 'Cotton Percale Jacquard', slug: 'cotton-percale-jacquard', material: 'Cotton Percale' },
  // 2026-11-02 用户定：percalecheck 家族实为涤纶水洗毛面（1688 供应链确认），命名改 Washed Cotton 系；
  // slug 不动以保持已建 URL/handle 稳定，仅改展示命名与材质
  'percalecheck':  { title: 'Soft Washed Cotton Feel Check', slug: 'cotton-percale-check-jacquard', material: 'Washed Cotton-Like' },
  'percalepatch':  { title: 'Cotton Percale Jacquard Patchwork', slug: 'cotton-percale-jacquard-patchwork', material: 'Cotton Percale' },
  'percalestripe': { title: 'Cotton Percale Jacquard Stripe', slug: 'cotton-percale-jacquard-stripe', material: 'Cotton Percale' },
  'washstripe':    { title: 'Washed Cotton Stripe', slug: 'washed-cotton-stripe', material: 'Washed Cotton-Like' },
  'washjac':       { title: 'Soft Washed Cotton Jacquard', slug: 'washed-cotton-jacquard', material: 'Washed Cotton-Like' },
  'veljac':        { title: 'Jacquard Velvet', slug: 'jacquard-velvet', material: 'Embossed Velvet' },
  'velstripe':     { title: 'Striped Velvet', slug: 'striped-velvet', material: 'Embossed Velvet' },
  'mk-heart4':     { title: 'Linen Feel Heart Print', slug: 'linen-feel-heart', material: 'Linen-Like' },
  'mk-print4':     { title: 'Linen Feel Print', slug: 'linen-feel-print', material: 'Linen-Like' },
  'mk-floral4':    { title: 'Linen Feel Floral Print', slug: 'linen-feel-floral', material: 'Linen-Like' },
  'mk-btfly4':     { title: 'Linen Feel Butterfly Print', slug: 'linen-feel-butterfly', material: 'Linen-Like' },
  '1025015219200': { title: 'Cotton Blend Muslin', slug: 'cotton-blend-muslin', material: 'Cotton Blend' },
};
const PATTERN_WORDS = ['Check', 'Checker', 'Gingham', 'Polka', 'Tartan'];

function lineOf(fam) {
  const k = fam.key.toLowerCase();
  if (k.includes('::')) return k.split('::')[0];
  for (const l of LINES) if (k.startsWith(l + '-')) return l;
  return k.split('-')[0];
}
/** famToken = 家族 key 的小写 slug（数字货号家族用 rep asin 去 -queen 尾缀，如 1025015219200-c1） */
function famTokenOf(fam) {
  return fam.rep.asin.toLowerCase().replace(/-queen$/, '');
}
/** 标题/描述用的面料短语 + handle 用面料 slug */
function fabricOf(fam) {
  const line = lineOf(fam);
  if (line === '1071466105053') {
    const words = fam.color.split(' ');
    const last = words[words.length - 1];
    const p = PATTERN_WORDS.includes(last) ? last : '';
    return { title: 'Cotton Feel' + (p ? ' ' + p : ''), slug: 'cotton-feel' + (p ? '-' + p.toLowerCase() : ''), material: 'Washed Cotton-Like' };
  }
  return LINE_INFO[line];
}
/** handle 用颜色 token */
function colorTokenOf(fam) {
  const k = fam.key.toLowerCase();
  if (k.includes('::')) {
    // 数字货号家族：颜色名去末尾图案词（Grey Gingham → grey、Sage Pink Check → sage-pink）
    const words = fam.color.split(' ');
    if (PATTERN_WORDS.includes(words[words.length - 1])) words.pop();
    return words.join('-').toLowerCase();
  }
  const line = lineOf(fam);
  return k.slice(line.length + 1);
}

/* ================= 规格 ================= */
const DUV_IN = { Twin: '71 x 87', Full: '79 x 91', Queen: '87 x 94', King: '104 x 90' };
const FIT_IN = { Twin: '39 x 75', Full: '54 x 75', Queen: '60 x 80', King: '76 x 80' };
const FLAT_IN = { Twin: '66 x 96', Full: '80 x 96', Queen: '90 x 102', King: '108 x 102' };
const DIMS_CM = {
  sheetset: { Twin: [168, 244], Full: [203, 244], Queen: [229, 259], King: [274, 259] },
  duvetset: { Twin: [180, 220], Full: [200, 230], Queen: [220, 240], King: [264, 229] },
  duvet: { Twin: [180, 220], Full: [200, 230], Queen: [220, 240], King: [264, 229] },
  pillowcase: { Twin: [51, 76], Full: [51, 76], Queen: [51, 76], King: [51, 76] },
};
const CM_SIZE = { Twin: '170 x 220 cm', Full: '200 x 220 cm', Queen: '220 x 220 cm', King: '260 x 220 cm' };
const TIER_LOWER = { Twin: 'twin', Full: 'full', Queen: 'queen', King: 'king' };
const TIERS = ['Twin', 'Full', 'Queen', 'King'];

/* ================= 标题/描述/短标题 ================= */
function titleOf(kind, fabTitle, color, tier) {
  const twin = tier === 'Twin';
  if (kind === 'sheetset')
    return `Makimoo ${tier} Sheet Set ${twin ? 3 : 4} Piece ${fabTitle} Fitted Sheet Flat Sheet ${twin ? '1 Pillowcase' : '2 Pillowcases'} (${color})`;
  if (kind === 'duvetset')
    return `Makimoo ${tier} Duvet Cover Set ${twin ? 2 : 3} Piece ${fabTitle} Duvet Cover ${twin ? '1 Pillowcase' : '2 Pillowcases'} (${color})`;
  if (kind === 'duvet')
    return `Makimoo ${fabTitle} Duvet Cover Only ${DUV_IN[tier]} in with Zipper Closure Corner Ties (${color}, ${tier})`;
  return `Makimoo ${fabTitle} Pillowcases Set of 2 ${tier} Size 20 x 30 in (${color}, ${tier})`;
}
function shortTitleOf(kind, fabTitle, color, tier) {
  const twin = tier === 'Twin';
  if (kind === 'sheetset') return `${fabTitle} Sheet Set, ${twin ? 3 : 4} Piece, ${color}, ${tier}`;
  if (kind === 'duvetset') return `${fabTitle} Duvet Cover Set, ${twin ? 2 : 3} Piece, ${color}, ${tier}`;
  if (kind === 'duvet') return `${fabTitle} Duvet Cover, ${color}, ${tier}`;
  return `${fabTitle} Pillowcases, Set of 2, ${color}, ${tier}`;
}
function paragraphsOf(kind, fabTitle, color, tier) {
  const twin = tier === 'Twin';
  const pcPhrase = twin ? '1 pillowcase' : '2 pillowcases';
  if (kind === 'sheetset') return [
    `${fabTitle} in ${color}: This ${tier.toLowerCase()} sheet set pairs a smooth flat sheet and a deep-pocket fitted sheet with matching ${pcPhrase}—soft, breathable and gentle against the skin, keeping you comfortable through every season.`,
    `Complete ${tier} ${twin ? 3 : 4}-Piece Sheet Set: Includes 1 fitted sheet (${FIT_IN[tier]} in) with a deep pocket and all-around elastic for a secure fit, 1 flat sheet (${FLAT_IN[tier]} in), and ${pcPhrase} (20 x 30 in)—a complete foundation layer that pairs easily with any duvet cover or comforter.`,
    `Thoughtful Details & Easy Care: The deep-pocket fitted sheet hugs mattresses up to 16 in thick and stays snug without slipping; the set is machine washable and gets even softer with every wash.`,
    `${color} Colorway: A calm, versatile palette that brings a quiet, effortless order to the bedroom, pairing easily with modern, classic, or cozy décor.`,
  ];
  if (kind === 'duvetset') return [
    `${fabTitle} in ${color}: A coordinated ${tier.toLowerCase()} duvet cover set with a soft, breathable hand—gentle against the skin and easy to layer through every season.`,
    `Complete ${tier} ${twin ? 2 : 3}-Piece Duvet Cover Set: Includes 1 duvet cover (${DUV_IN[tier]} in) with a hidden zipper closure and interior corner ties to keep your insert neatly in place, and ${pcPhrase} (20 x 30 in). Comforter insert not included.`,
    `Easy Care: Machine washable and softens with every wash; the hidden zipper keeps a clean, finished look.`,
    `${color} Colorway: A calm, versatile palette that brings a quiet, effortless order to the bedroom, pairing easily with modern, classic, or cozy décor.`,
  ];
  if (kind === 'duvet') return [
    `${fabTitle} Duvet Cover Only in ${color}: A standalone ${tier.toLowerCase()} duvet cover—soft, breathable and gentle against the skin, an easy way to refresh your bed without replacing the whole set.`,
    `${tier} Size & Secure Fit: Measures ${DUV_IN[tier]} in, with a hidden zipper closure and interior corner ties that keep your comforter neatly in place. Comforter insert not included.`,
    `Easy Care: Machine washable and gets even softer with every wash.`,
    `${color} Colorway: A calm, versatile palette that brings a quiet, effortless order to the bedroom, pairing easily with modern, classic, or cozy décor.`,
  ];
  return [
    `${fabTitle} Pillowcases in ${color}: A pair of matching pillowcases in a soft, breathable weave—gentle against the skin for comfortable, year-round sleep.`,
    `Set of 2, ${tier} Size: Each pillowcase measures 20 x 30 in with an envelope closure that keeps your pillow neatly tucked inside.`,
    `Easy Care: Machine washable and gets even softer with every wash.`,
    `${color} Colorway: A calm, versatile palette that brings a quiet, effortless order to the bedroom, pairing easily with modern, classic, or cozy décor.`,
  ];
}

/* ================= 既有产品（并入新组，不重建） ================= */
// 9 个 sheetset-*-queen（vine 四件套已删、ivory-pc 无对应四件套花色，作为独立颜色成员入组）
const EXISTING_SHEETSET = [
  { asin: 'SHEETSET-SAND-QUEEN', handle: 'makimoo-queen-sheet-set-4-piece-cotton-percale-check-jacquard-sand-queen', gid: 'PERCALECHECK-SHEETSET', color: 'Sand Beige' },
  { asin: 'SHEETSET-PETAL-QUEEN', handle: 'makimoo-queen-sheet-set-4-piece-cotton-percale-jacquard-stripe-petal-queen', gid: 'PERCALESTRIPE-SHEETSET', color: 'Blush Pink Stripe' },
  { asin: 'SHEETSET-SAGEGREEN-QUEEN', handle: 'makimoo-queen-sheet-set-4-piece-washed-cotton-stripe-sage-queen', gid: 'WASHSTRIPE-SHEETSET', color: 'Sage Green' },
  { asin: 'SHEETSET-GINGHAM-QUEEN', handle: 'makimoo-queen-sheet-set-4-piece-cotton-feel-gingham-grey-queen', gid: '1071466105053-SHEETSET', color: 'Grey Gingham' },
  { asin: 'SHEETSET-HEART-QUEEN', handle: 'makimoo-queen-sheet-set-4-piece-linen-feel-heart-tan-queen', gid: 'MK-HEART4-SHEETSET', color: 'Tan Heart' },
  { asin: 'SHEETSET-VINE-QUEEN', handle: 'makimoo-queen-sheet-set-4-piece-embossed-velvet-pom-pom-vine-queen', gid: 'POMPOM4-SHEETSET', color: 'Olive Vine' },
  { asin: 'SHEETSET-IVORY-QUEEN', handle: 'makimoo-queen-sheet-set-4-piece-jacquard-velvet-ivory-queen', gid: 'VELJAC-SHEETSET', color: 'Ivory White' },
  { asin: 'SHEETSET-MOCHA-QUEEN', handle: 'makimoo-queen-sheet-set-4-piece-striped-velvet-mocha-queen', gid: 'VELSTRIPE-SHEETSET', color: 'Sage Stripe' },
  { asin: 'SHEETSET-POLKA-QUEEN', handle: 'makimoo-queen-sheet-set-4-piece-cotton-feel-polka-blue-queen', gid: '1071466105053-SHEETSET', color: 'Blue Polka' },
];
// 19 个 *-duvet（含 DUVSET-GRAY-DUVET 与孤儿 POMPOM4-VINE-DUVET）
const EXISTING_DUVET = [
  { asin: 'PERCALE-SKY-DUVET', handle: 'makimoo-cotton-percale-duvet-cover-only-sky-blue-queen-percale-sky-duvet', gid: 'PERCALE-DUVET', color: 'Sky Blue', size: '220 x 220 cm' },
  { asin: 'PERCALE-MIST-TWIN-DUVET', handle: 'makimoo-cotton-percale-duvet-cover-only-mist-grey-twin-percale-mist-twin-duvet', gid: 'PERCALE-DUVET', color: 'Mist Grey', size: '170 x 220 cm' },
  { asin: 'PERCALE-MIST-FULL-DUVET', handle: 'makimoo-cotton-percale-duvet-cover-only-mist-grey-full-percale-mist-full-duvet', gid: 'PERCALE-DUVET', color: 'Mist Grey', size: '200 x 220 cm' },
  { asin: 'PERCALE-MIST-DUVET', handle: 'makimoo-cotton-percale-duvet-cover-only-mist-grey-queen-percale-mist-duvet', gid: 'PERCALE-DUVET', color: 'Mist Grey', size: '220 x 220 cm' },
  { asin: 'PERCALE-MIST-KING-DUVET', handle: 'makimoo-cotton-percale-duvet-cover-only-mist-grey-king-percale-mist-king-duvet', gid: 'PERCALE-DUVET', color: 'Mist Grey', size: '260 x 220 cm' },
  { asin: 'PERCALE-COCONUT-QUEEN-DUVET', handle: 'makimoo-cotton-percale-duvet-cover-only-coconut-milk-queen-percale-coconut-queen-duvet', gid: 'PERCALE-DUVET', color: 'Coconut Milk', size: '220 x 220 cm' },
  { asin: 'PERCALE-NUDE-DUVET', handle: 'makimoo-cotton-percale-duvet-cover-only-nude-pink-queen-percale-nude-duvet', gid: 'PERCALE-DUVET', color: 'Nude Pink', size: '220 x 220 cm' },
  { asin: 'LINEN3-IVORY-DUVET', handle: 'makimoo-100-linen-duvet-cover-only-ivory-soft-washed-linen3-ivory-duvet', gid: 'LINEN3-DUVET', color: 'Ivory', size: '220 x 220 cm' },
  { asin: 'LINEN3-SAGE-DUVET', handle: 'makimoo-100-linen-duvet-cover-only-sage-green-soft-washed-linen3-sage-duvet', gid: 'LINEN3-DUVET', color: 'Sage Green', size: '220 x 220 cm' },
  { asin: 'LINEN3-OATMEAL-DUVET', handle: 'makimoo-100-linen-duvet-cover-only-oatmeal-soft-washed-linen3-oatmeal-duvet', gid: 'LINEN3-DUVET', color: 'Oatmeal', size: '220 x 220 cm' },
  { asin: 'LINEN3-CHARCOAL-DUVET', handle: 'makimoo-100-linen-duvet-cover-only-charcoal-grey-soft-washed-linen3-charcoal-duvet', gid: 'LINEN3-DUVET', color: 'Charcoal Grey', size: '220 x 220 cm' },
  { asin: 'LINEN3-DUSTYBLUE-DUVET', handle: 'makimoo-100-linen-duvet-cover-only-dusty-blue-soft-washed-linen3-dustyblue-duvet', gid: 'LINEN3-DUVET', color: 'Dusty Blue', size: '220 x 220 cm' },
  { asin: 'DUVSET-GRAY-DUVET', handle: 'makimoo-washed-cotton-like-duvet-cover-only-gray-breathable-duvset-gray-duvet', gid: 'DUVSET-DUVET', color: 'Grey', size: 'Queen' },
  { asin: 'PERCALEJAC-HAZE-DUVET', handle: 'makimoo-cotton-percale-jacquard-wide-stripe-duvet-cover-only-dusty-blue-queen-percalejac-haze-duvet', gid: 'PERCALEJAC-DUVET', color: 'Dusty Blue', size: 'Queen' },
  { asin: 'PERCALEPATCH-STONE-DUVET', handle: 'makimoo-cotton-percale-jacquard-patchwork-duvet-cover-only-stone-grey-queen-percalepatch-stone-duvet', gid: 'PERCALEPATCH-DUVET', color: 'Stone Grey Patchwork', size: 'Queen' },
  { asin: 'PERCALESTRIPE-PETAL-DUVET', handle: 'makimoo-cotton-percale-jacquard-fine-stripe-duvet-cover-only-blush-pink-queen-percalestripe-petal-duvet', gid: 'PERCALESTRIPE-DUVET', color: 'Blush Pink Stripe', size: 'Queen' },
  { asin: 'POMPOM4-VINE-DUVET', handle: 'makimoo-embossed-velvet-pom-pom-duvet-cover-only-olive-vine-queen-pompom4-vine-duvet', gid: 'POMPOM4-DUVET', color: 'Olive Vine', size: 'Queen' },
  { asin: 'WASHJAC-CREAM-DUVET', handle: 'makimoo-washed-cotton-jacquard-duvet-cover-only-cream-white-queen-washjac-cream-duvet', gid: 'WASHJAC-DUVET', color: 'Cream White', size: 'Queen' },
  { asin: 'VELJAC-IVORY-DUVET', handle: 'makimoo-jacquard-velvet-duvet-cover-only-ivory-white-queen-veljac-ivory-duvet', gid: 'VELJAC-DUVET', color: 'Ivory White', size: 'Queen' },
];
// 2 个 *-pc-*
const EXISTING_PC = [
  { asin: 'PERCALEJAC-HAZE-PC-QUEEN', handle: 'makimoo-cotton-percale-jacquard-pillowcases-set-of-2-queen-dusty-blue-percalejac-haze-pc-queen', gid: 'PERCALEJAC-PC', color: 'Dusty Blue', size: 'Queen' },
  { asin: 'PERCALEJAC-IVORY-PC-QUEEN', handle: 'makimoo-cotton-percale-jacquard-pillowcases-set-of-2-queen-ivory-percalejac-ivory-pc-queen', gid: 'PERCALEJAC-PC', color: 'Ivory White', size: 'Queen' },
];
// PERCALE-DUVET 重建时的颜色顺序（对齐 PERCALE 套装组）
const PERCALE_COLOR_ORDER = ['Sky Blue', 'Mist Grey', 'Coconut Milk', 'Nude Pink', 'Eucalyptus', 'Lavender Fog'];
const LINEN3_COLOR_ORDER = ['Ivory', 'Sage Green', 'Oatmeal', 'Charcoal Grey', 'Dusty Blue'];
// 既有成员的颜色排序锚（对齐对应四件套家族 rep asin；orphan 颜色排最后）
const EXISTING_COK = {
  'SHEETSET-SAND-QUEEN': 'percalecheck-sand-queen', 'SHEETSET-PETAL-QUEEN': 'percalestripe-petal-queen',
  'SHEETSET-SAGEGREEN-QUEEN': 'washstripe-sagegreen-queen', 'SHEETSET-GINGHAM-QUEEN': '1071466105053-c3',
  'SHEETSET-HEART-QUEEN': 'mk-heart4-tan-queen', 'SHEETSET-VINE-QUEEN': '~pompom4-vine-queen',
  'SHEETSET-IVORY-QUEEN': 'veljac-ivory-queen', 'SHEETSET-MOCHA-QUEEN': 'velstripe-mocha-queen',
  'SHEETSET-POLKA-QUEEN': '1071466105053-c10',
  'PERCALEJAC-HAZE-PC-QUEEN': 'percalejac-haze-queen', 'PERCALEJAC-IVORY-PC-QUEEN': '~percalejac-ivory-pc',
  'DUVSET-GRAY-DUVET': 'duvset-gray-queen', 'PERCALEJAC-HAZE-DUVET': 'percalejac-haze-queen',
  'PERCALEPATCH-STONE-DUVET': 'percalepatch-stone-queen', 'PERCALESTRIPE-PETAL-DUVET': 'percalestripe-petal-queen',
  'POMPOM4-VINE-DUVET': '~pompom4-vine-duvet', 'WASHJAC-CREAM-DUVET': 'washjac-cream-queen',
  'VELJAC-IVORY-DUVET': 'veljac-ivory-queen',
};

/* ================= 7 个规划新增四件套（读 xlsx 确认 SKU；元数据按供应链货号登记） ================= */
const PLANNED_FOUR = {
  '1000548719212-C2': { asin: 'PERCALECHECK-C2', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-feel-check-khaki-queen', color: 'Khaki', gid: 'PERCALECHECK', fabTitle: 'Soft Washed Cotton Feel Check', material: 'Washed Cotton-Like' },
  '1000548719212-C3': { asin: 'PERCALECHECK-C3', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-feel-check-light-grey-queen', color: 'Light Grey', gid: 'PERCALECHECK', fabTitle: 'Soft Washed Cotton Feel Check', material: 'Washed Cotton-Like' },
  '975921009077-c5': { asin: 'PERCALEPATCH-C5', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-patchwork-mauve-queen', color: 'Warm Mauve', gid: 'PERCALEPATCH', fabTitle: '100% Cotton Percale Jacquard Patchwork', material: 'Cotton Percale' },
  '975921009077-c6': { asin: 'PERCALESTRIPE-C6', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-stripe-coffee-queen', color: 'Light Coffee', gid: 'PERCALESTRIPE', fabTitle: '100% Cotton Percale Jacquard Fine Stripe', material: 'Cotton Percale' },
  '975921009077-c7': { asin: 'PERCALESTRIPE-C7', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-stripe-blue-queen', color: 'Blue', gid: 'PERCALESTRIPE', fabTitle: '100% Cotton Percale Jacquard Fine Stripe', material: 'Cotton Percale' },
  '1047846553177-c2': { asin: 'WASHJAC-C2', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-jacquard-grey-queen', color: 'Grey', gid: 'WASHJAC', fabTitle: 'Soft Washed Cotton Jacquard', material: 'Washed Cotton-Like' },
  '1047846553177-c3': { asin: 'WASHJAC-C3', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-jacquard-dark-grey-queen', color: 'Dark Grey', gid: 'WASHJAC', fabTitle: 'Soft Washed Cotton Jacquard', material: 'Washed Cotton-Like' },
};
let plannedFourSkus = [];
{
  let wb;
  try {
    wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(XLSX);
  } catch (e) {
    if (e && (e.code === 'EBUSY' || /EBUSY/i.test(e.message))) {
      console.error('读取 xlsx 失败（文件被占用）：请先关闭 Excel 里的 bedding-sku表.xlsx 再重跑本脚本。');
      process.exit(1);
    }
    throw e;
  }
  const ws = wb.getWorksheet('Sheets & Duvet Set');
  const txt = (v) => (v == null ? '' : typeof v === 'object' ? (v.text || v.hyperlink || '') : String(v));
  for (let r = 2; r <= ws.rowCount; r++) {
    // 2026-11-01 起按货号匹配（状态列可能已被表格回填脚本标为「站内已有」，货号不变）
    const sku = txt(ws.getCell(r, 8).value).trim();
    if (PLANNED_FOUR[sku]) plannedFourSkus.push(sku);
  }
  const missing = plannedFourSkus.filter((s) => !PLANNED_FOUR[s]);
  if (missing.length) {
    console.error('xlsx 里出现未登记颜色元数据的规划四件套货号：', missing.join(', '), '——请先在脚本的 PLANNED_FOUR 里补充。');
    process.exit(1);
  }
  if (plannedFourSkus.length !== 7) console.warn(`! 预期 7 条规划新增四件套，实际读到 ${plannedFourSkus.length} 条：${plannedFourSkus.join(', ')}`);
}

/* ================= 规划 SKU（固化记录，不重新随机） ================= */
const skuLog = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/_shots/tab-new-skus-20261101.json'), 'utf8'));
const TAB2KIND = { 'Sheet Set': 'sheetset', 'Duvet Cover': 'duvet', 'Duvet Cover Set': 'duvetset', 'Pillow & Sham': 'pillowcase' };
const KIND2TYPEWORD = { sheetset: 'sheetset', duvetset: 'duvetset', duvet: 'duvet', pillowcase: 'pc' };
const KIND2TYPESUFFIX = { sheetset: 'SHEETSET', duvetset: 'DUVETSET', duvet: 'DUVET', pillowcase: 'PC' };

/* 现有 asin/handle 全集（去重依据） */
const existingAsins = new Set();
const existingHandles = new Set();
for (const f of ['src/data/products.ts', 'src/data/products-materials.ts']) {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  for (const m of src.matchAll(/"asin":\s*"([^"]+)"/g)) existingAsins.add(m[1].toLowerCase());
  for (const m of src.matchAll(/"handle":\s*"([^"]+)"/g)) existingHandles.add(m[1].toLowerCase());
}

/* ================= 组装新产品 ================= */
const newProducts = []; // {asin, handle, title, shortTitle, description, descriptionHtml, images, whiteBg, featuredImage, sku, material, dimsCm, gid, gcolor, gsize}
const groups = new Map(); // gid -> { optionName, members: [{asin, handle, color, size, _order}] }
let skippedExisting = 0;

function addGroupMember(gid, optionName, member) {
  if (!groups.has(gid)) groups.set(gid, { optionName, members: [] });
  const g = groups.get(gid);
  if (g.members.some((m) => m.asin.toLowerCase() === member.asin.toLowerCase())) return;
  if (!member.colorOrderKey && (EXISTING_COK[member.asin] || EXISTING_COK[member.asin.toUpperCase()]))
    member = { ...member, colorOrderKey: EXISTING_COK[member.asin] || EXISTING_COK[member.asin.toUpperCase()] };
  g.members.push(member);
}

const repImageCache = new Map();
function repImages(repAsin) {
  const key = repAsin.toLowerCase();
  if (repImageCache.has(key)) return repImageCache.get(key);
  const info = mmMap[key] || { images: [], whiteBg: [] };
  const out = {
    images: info.images.length ? info.images : [`/images/products/${repAsin.toUpperCase()}/1.webp`],
    whiteBg: info.whiteBg.length === info.images.length ? info.whiteBg : info.images.map(() => false),
  };
  if (!info.images.length) console.warn(`! 家族代表款 ${repAsin} 在 materials-map 无图片，回退 1.webp`);
  repImageCache.set(key, out);
  return out;
}

for (const [key, sku] of Object.entries(skuLog)) {
  const [tab, famKey, tier] = key.split('|');
  const kind = TAB2KIND[tab];
  const fam = famByKey.get(famKey.toLowerCase());
  if (!fam) { console.error(`家族未找到：${key}`); process.exit(1); }
  const token = famTokenOf(fam);
  const line0 = lineOf(fam);
  // 2026-11-01 用户定：PERCALE 六色的 Duvet Cover Set 不新建——现有 percale-* 三件套产品即该类型
  // （F/Q/K handle 与现有产品完全重复；Twin 2-piece 重复品已撤下），表格行指向现有产品
  if (kind === 'duvetset' && line0 === 'percale') continue;
  const line = lineOf(fam);
  const fab = fabricOf(fam);
  const colorToken = colorTokenOf(fam);
  const t = TIER_LOWER[tier];

  let asin;
  if (kind === 'sheetset') asin = `SHEETSET-${token}-${t}`;
  else if (kind === 'duvetset') asin = `DUVETSET-${token}-${t}`;
  else if (kind === 'duvet') asin = `${token}-${t}-duvet`;
  else asin = `${token}-pc-${t}`;
  asin = asin.toUpperCase();

  const mid = `${fab.slug}-${colorToken}`;
  const suffix = (fam.key.includes('::') || line.startsWith('mk-')) ? `-${token}-${KIND2TYPEWORD[kind]}` : '';
  let handle;
  if (kind === 'sheetset') handle = `makimoo-${t}-sheet-set-${tier === 'Twin' ? 3 : 4}-piece-${mid}-${t}${suffix}`;
  else if (kind === 'duvetset') handle = `makimoo-${t}-duvet-cover-set-${tier === 'Twin' ? 2 : 3}-piece-${mid}-${t}${suffix}`;
  else if (kind === 'duvet') handle = `makimoo-${t}-duvet-cover-only-${mid}-${t}${suffix}`;
  else handle = `makimoo-${t}-pillowcases-set-of-2-${mid}-${t}${suffix}`;

  if (existingAsins.has(asin.toLowerCase()) || existingHandles.has(handle.toLowerCase())) {
    console.warn(`! 跳过（已存在）：${asin} / ${handle}`);
    skippedExisting++;
    continue;
  }

  const title = titleOf(kind, fab.title, fam.color, tier);
  const paras = paragraphsOf(kind, fab.title, fam.color, tier);
  const rep = repImages(fam.rep.asin);
  // percale/linen3 独立被套组沿用 cm 尺寸风格，其余新组用 Twin/Full/Queen/King 档名
  const gsize = (kind === 'duvet' && (line === 'percale' || line === 'linen3')) ? CM_SIZE[tier] : tier;
  const gid = `${line.toUpperCase()}-${KIND2TYPESUFFIX[kind]}`;

  newProducts.push({
    asin, handle, title,
    shortTitle: shortTitleOf(kind, fab.title, fam.color, tier),
    paras,
    images: rep.images, whiteBg: rep.whiteBg,
    repAsin: fam.rep.asin,
    sku, material: fab.material, dimsCm: DIMS_CM[kind][tier],
    gid, gcolor: fam.color, gsize,
    colorOrderKey: fam.rep.asin.toLowerCase(),
  });
}

/* 既有产品并入新组 */
for (const e of EXISTING_SHEETSET) addGroupMember(e.gid, 'Size', { asin: e.asin, handle: e.handle, color: e.color, size: 'Queen', colorOrderKey: '' });
for (const e of EXISTING_PC) addGroupMember(e.gid, 'Size', { asin: e.asin, handle: e.handle, color: e.color, size: e.size, colorOrderKey: '' });
for (const e of EXISTING_DUVET) {
  if (e.gid === 'PERCALE-DUVET' || e.gid === 'LINEN3-DUVET') continue; // 这两个组整体重建（见下）
  addGroupMember(e.gid, 'Size', { asin: e.asin, handle: e.handle, color: e.color, size: e.size, colorOrderKey: '' });
}

/* 7 个规划新增四件套 */
const fourProducts = [];
for (const sku of plannedFourSkus) {
  const meta = PLANNED_FOUR[sku];
  const title = `Makimoo Queen Bedding Set 4 Piece ${meta.fabTitle} Duvet Cover Fitted Sheet 2 Pillowcases 88 x 88 in (${meta.color})`;
  const paras = [
    `${meta.fabTitle}: Woven for a soft, breathable hand that feels gentle against the skin, this 4-piece bedding set keeps you comfortable through every season and gets even softer with every wash.`,
    `Complete Queen 4-Piece Set: Includes 1 duvet cover (88 x 88 in) with a hidden zipper closure and interior corner ties, 1 fitted sheet (60 x 80 in) with a deep pocket and all-around elastic, and 2 pillowcases (20 x 30 in).`,
    `Thoughtful Details & Easy Care: The deep-pocket fitted sheet hugs mattresses up to 16 in thick; the set is machine washable for easy everyday care.`,
    `${meta.color} Colorway: A calm, versatile palette that brings a quiet, effortless order to the bedroom, pairing easily with modern, classic, or cozy décor.`,
  ];
  fourProducts.push({
    asin: meta.asin, handle: meta.handle, title,
    shortTitle: `${meta.fabTitle} Bedding Set, 4 Piece, ${meta.color}, Queen`,
    paras,
    images: [`/images/products/${meta.asin}/1.webp`], whiteBg: [false],
    repAsin: null, sku, material: meta.material, dimsCm: [220, 240],
    gid: meta.gid, gcolor: meta.color, gsize: '220 x 220 cm',
    supplyJpg: path.join(SUPPLY_DIR, `${sku}.jpg`),
  });
}

/* ================= 图片尺寸探测（rep 图复用） + featuredImage ================= */
const imgDims = new Map();
async function dimsOf(rel) {
  if (imgDims.has(rel)) return imgDims.get(rel);
  let d = { width: 1200, height: /-3x4\./.test(rel) ? 1600 : 1200 };
  const file = path.join(ROOT, 'public', rel);
  try {
    const meta = await sharp(file).metadata();
    if (meta.width && meta.height) d = { width: meta.width, height: meta.height };
  } catch { console.warn(`! 图片文件缺失，尺寸用回退值：${rel}`); }
  imgDims.set(rel, d);
  return d;
}
for (const p of [...newProducts, ...fourProducts]) {
  p.imageObjs = [];
  for (const rel of p.images) {
    const d = await dimsOf(rel);
    p.imageObjs.push({ url: rel, altText: p.title, width: d.width, height: d.height });
  }
  if (p.repAsin) {
    const main = `/images/products/${p.repAsin.toUpperCase()}/0-main-3x4.webp`;
    p.featuredImage = fs.existsSync(path.join(ROOT, 'public', main)) ? main : null;
  }
}

/* ================= 7 个四件套的供应链图 → public webp ================= */
for (const p of fourProducts) {
  const outFile = path.join(ROOT, 'public', p.images[0]);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  if (!fs.existsSync(p.supplyJpg)) { console.error(`供应链图缺失：${p.supplyJpg}`); process.exit(1); }
  // 先转 buffer 再写文件 + 重试：Windows 下目标路径可能被 AV/索引器瞬时占用
  const buf = await sharp(p.supplyJpg).webp({ quality: 85 }).toBuffer();
  let written = false;
  for (let attempt = 0; attempt < 5 && !written; attempt++) {
    try {
      fs.writeFileSync(outFile, buf);
      written = true;
    } catch (e) {
      console.warn(`! 写入失败（${p.asin}，第 ${attempt + 1} 次）：${e.code || e.message}，1s 后重试`);
      await new Promise((res) => setTimeout(res, 1000));
    }
  }
  if (!written) { console.error(`图片写入失败：${outFile}`); process.exit(1); }
  console.log(`图片：${p.supplyJpg} → ${p.images[0]}`);
}

/* ================= 变体组文本 ================= */
const CM_LINE_DUVET = new Set(['PERCALE-DUVET', 'LINEN3-DUVET']);
// 既有四件套组：保持原成员在前、规划新增按货号顺序追加，不做颜色排序
const FOUR_GIDS = new Set(['PERCALECHECK', 'PERCALEPATCH', 'PERCALESTRIPE', 'WASHJAC']);
const memberLine = (m) => `    { asin: '${m.asin}', handle: '${m.handle}', color: '${m.color.replace(/'/g, "\\'")}', size: '${m.size}' },`;
function groupMembersText(gid) {
  const g = groups.get(gid);
  if (FOUR_GIDS.has(gid)) return g.members.map(memberLine).join('\n');
  // 颜色序：PERCALE/LINEN3 用既定顺序，其余按家族 rep asin 字典序（orphan 颜色排最后）
  const colorOrder = new Map();
  if (gid === 'PERCALE-DUVET') PERCALE_COLOR_ORDER.forEach((c, i) => colorOrder.set(c, i));
  else if (gid === 'LINEN3-DUVET') LINEN3_COLOR_ORDER.forEach((c, i) => colorOrder.set(c, i));
  else {
    const keys = [...new Set(g.members.map((m) => m.colorOrderKey || '~' + m.color))].sort();
    keys.forEach((k, i) => colorOrder.set(k, i));
  }
  const orderOf = (m) => (gid === 'PERCALE-DUVET' || gid === 'LINEN3-DUVET')
    ? colorOrder.get(m.color) ?? 99
    : colorOrder.get(m.colorOrderKey || '~' + m.color) ?? 99;
  const sizeOrder = (s) => {
    const i = ['Twin', 'Full', 'Queen', 'King'].indexOf(s);
    if (i >= 0) return i;
    const j = ['170 x 220 cm', '200 x 220 cm', '220 x 220 cm', '260 x 220 cm'].indexOf(s);
    return j >= 0 ? j : 99;
  };
  const sorted = [...g.members].sort((a, b) => orderOf(a) - orderOf(b) || sizeOrder(a.size) - sizeOrder(b.size) || a.asin.localeCompare(b.asin));
  return sorted.map((m) => `    { asin: '${m.asin}', handle: '${m.handle}', color: '${m.color.replace(/'/g, "\\'")}', size: '${m.size}' },`).join('\n');
}

// 把新产品的成员登记进组（在既有成员之后 append，排序统一在输出时做）
for (const p of newProducts) addGroupMember(p.gid, 'Size', { asin: p.asin, handle: p.handle, color: p.gcolor, size: p.gsize, colorOrderKey: p.colorOrderKey });

// 既有组整体重建清单（原成员 + 新增成员）
const REBUILT = [];
{
  // PERCALE-DUVET
  const g = groups.get('PERCALE-DUVET') || { members: [] };
  const members = [
    ...EXISTING_DUVET.filter((e) => e.gid === 'PERCALE-DUVET').map((e) => ({ ...e, colorOrderKey: '' })),
    ...g.members,
  ];
  REBUILT.push({ id: 'PERCALE-DUVET', optionName: 'Size', comment: 'Cotton Percale 独立被套（2026-10-24 建组；2026-11-01 扩展：补 Sky/Coconut/Nude 缺失尺寸，新增 Eucalyptus/Lavender Fog 两色全尺寸）', members });
  groups.set('PERCALE-DUVET', { optionName: 'Size', members });
}
{
  // LINEN3-DUVET（原 5 色 Queen 补 cm 尺寸标注 + 每色补 Twin/Full/King）
  const g = groups.get('LINEN3-DUVET') || { members: [] };
  const members = [
    ...EXISTING_DUVET.filter((e) => e.gid === 'LINEN3-DUVET').map((e) => ({ ...e, colorOrderKey: '' })),
    ...g.members,
  ];
  REBUILT.push({ id: 'LINEN3-DUVET', optionName: 'Color', comment: 'LINEN3 独立被套（2026-10-24 建组；2026-11-01 扩展：5 色各补 Twin/Full/King 尺寸，Queen 补 cm 尺寸标注）', members });
  groups.set('LINEN3-DUVET', { optionName: 'Color', members });
}
// 7 个规划四件套加入对应四件套组（整体重建 4 个既有组）
const FOUR_GROUP_ORIGINALS = {
  'PERCALECHECK': [
    { asin: 'percalecheck-sand-queen', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-check-jacquard-sand-queen', color: 'Sand Beige', size: '220 x 220 cm' },
  ],
  'PERCALEPATCH': [
    { asin: 'percalepatch-stone-queen', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-patchwork-stone-queen', color: 'Stone Grey Patchwork', size: '220 x 220 cm' },
  ],
  'PERCALESTRIPE': [
    { asin: 'percalestripe-petal-queen', handle: 'makimoo-queen-bedding-set-4-piece-cotton-percale-jacquard-stripe-petal-queen', color: 'Blush Pink Stripe', size: '220 x 220 cm' },
  ],
  'WASHJAC': [
    { asin: 'washjac-cream-queen', handle: 'makimoo-queen-bedding-set-4-piece-washed-cotton-jacquard-cream-queen', color: 'Cream White', size: '220 x 220 cm' },
  ],
};
for (const p of fourProducts) {
  const members = [
    ...(FOUR_GROUP_ORIGINALS[p.gid] || []).map((e) => ({ ...e, colorOrderKey: '' })),
  ];
  // 保持同组追加顺序（按货号读取顺序）
  const appended = fourProducts.filter((x) => x.gid === p.gid);
  for (const x of appended) members.push({ asin: x.asin, handle: x.handle, color: x.gcolor, size: x.gsize, colorOrderKey: '' });
  if (!REBUILT.some((r) => r.id === p.gid))
    REBUILT.push({ id: p.gid, optionName: 'Color', comment: `2026-11-01 扩展：新增 ${appended.length} 个规划四件套颜色（供应链同款新色，图片为供应链图占位）`, members });
}

/* ================= 产物 1：products-planned.ts（整体重写） ================= */
const allNew = [...newProducts, ...fourProducts];
function productEntryText(p) {
  const entry = {
    id: `makimoo-${p.asin}`,
    asin: p.asin,
    title: p.title,
    handle: p.handle,
    description: p.paras.join(' '),
    descriptionHtml: p.paras.map((x) => `<p>${x}</p>`).join(''),
    productType: 'Bedding',
    tags: ['Bedding'],
    availableForSale: false,
    ...(p.featuredImage ? { featuredImage: p.featuredImage } : {}),
    images: p.imageObjs,
    priceRange: { minVariantPrice: { amount: '0.00', currencyCode: 'USD' } },
    variants: [{ id: `variant-${p.asin}`, title: 'Default Title', price: { amount: '0.00', currencyCode: 'USD' }, availableForSale: false, selectedOptions: [] }],
    amazonUrl: '',
  };
  return JSON.stringify(entry, null, 4).replace(/\n/g, '\n');
}
const plannedTs = `/**
 * AUTO-GENERATED by scripts/_create-planned-products-20261101.js — 重跑脚本可整体再生成，手工修改会被覆盖。
 * 2026-11-01 方案：bedding 四类型（Sheet Set / Duvet Cover Set / Duvet Cover / Pillowcases）规划 SKU 占位产品
 * ${newProducts.length} 个 + ${fourProducts.length} 个规划新增四件套，全部 price 0.00 / availableForSale false（Coming Soon），
 * 后续 Shopify 建品后由 build-shopify-map 自动接上价格/库存。
 * 图片暂引用对应四件套家族代表款（Queen）图，后续批量生成再换。
 */
import type { MakimooProduct } from './products';

export const PLANNED_PRODUCTS: MakimooProduct[] = [
${allNew.map((p) => productEntryText(p)).join(',\n')},
];
`;
fs.writeFileSync(path.join(ROOT, 'src/data/products-planned.ts'), plannedTs);
console.log(`已写 src/data/products-planned.ts：${allNew.length} 个产品`);

/* ================= 幂等工具：移除标记块 ================= */
function stripMarked(src) {
  return src.replace(new RegExp(`[^\\n]*>>> ${MARK}[\\s\\S]*?<<< ${MARK}[^\\n]*\\n`, 'g'), '');
}

/* ================= 产物 2：materials-map.ts 追加条目 ================= */
{
  const file = path.join(ROOT, 'src/data/materials-map.ts');
  let src = stripMarked(fs.readFileSync(file, 'utf8'));
  const lines = allNew.map((p) => {
    const entry = {
      title: p.title,
      bullets: p.paras.join('\n\n'),
      sku: p.sku,
      images: p.images,
      whiteBg: p.whiteBg.length === p.images.length ? p.whiteBg : p.images.map(() => false),
    };
    return `  "${p.asin.toLowerCase()}": ${JSON.stringify(entry)},`;
  });
  const block = `  // >>> ${MARK}（bedding 规划 SKU 占位条目；图片复用家族代表款，重跑脚本整体替换）\n${lines.join('\n')}\n  // <<< ${MARK}\n`;
  const anchor = '\n};\n\n/** 素材库之外的老产品的白底图标记';
  if (!src.includes(anchor)) { console.error('materials-map.ts 结尾锚点未找到'); process.exit(1); }
  src = src.replace(anchor, '\n' + block + '};\n\n/** 素材库之外的老产品的白底图标记');
  fs.writeFileSync(file, src);
  console.log(`已更新 src/data/materials-map.ts：+${lines.length} 条目`);
}

/* ================= 产物 3：variant-groups.ts ================= */
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  let src = stripMarked(fs.readFileSync(file, 'utf8'));
  // 移除将被整体重建的既有组（按 id 精确匹配）
  for (const r of REBUILT) {
    const idIdx = src.indexOf(`    id: '${r.id}',`);
    if (idIdx < 0) { console.warn(`! 未找到待重建组 ${r.id}（重跑时已被标记块整体替换，属正常），跳过移除`); continue; }
    const start = src.lastIndexOf('\n  {', idIdx);
    const end = src.indexOf('\n  },', idIdx);
    if (start < 0 || end < 0) { console.error(`variant-groups.ts 组 ${r.id} 边界解析失败`); process.exit(1); }
    src = src.slice(0, start) + src.slice(end + 5);
  }
  const groupText = (id, optionName, comment, membersText) =>
    `  {\n    // ${comment}\n    id: '${id}',\n    optionName: '${optionName}',\n    members: [\n${membersText}\n    ],\n  },`;
  const blocks = [];
  for (const r of REBUILT) {
    groups.set(r.id, { optionName: r.optionName, members: r.members });
    blocks.push(groupText(r.id, r.optionName, r.comment, groupMembersText(r.id)));
  }
  const KIND_ORDER = ['SHEETSET', 'DUVETSET', 'DUVET', 'PC'];
  const NEW_GROUP_COMMENTS = {
    SHEETSET: 'Sheet Set（颜色×尺寸，2026-11-01 规划 SKU 占位组）',
    DUVETSET: 'Duvet Cover Set（颜色×尺寸，2026-11-01 规划 SKU 占位组）',
    DUVET: '独立被套（颜色×尺寸，2026-11-01 规划 SKU 占位组）',
    PC: '枕套对装（颜色×尺寸，2026-11-01 规划 SKU 占位组）',
  };
  for (const line of LINES_ORDER) {
    for (const k of KIND_ORDER) {
      const gid = `${line.toUpperCase()}-${k}`;
      if (REBUILT.some((r) => r.id === gid)) continue;
      if (!groups.has(gid)) continue;
      blocks.push(groupText(gid, 'Size', `${line} ${NEW_GROUP_COMMENTS[k]}`, groupMembersText(gid)));
    }
  }
  const block = `  // >>> ${MARK}（bedding 四类型规划 SKU 变体组 + 既有组扩展，脚本可重跑整体替换）\n${blocks.join('\n')}\n  // <<< ${MARK}\n`;
  const anchor = '\n];\n\nconst groupsByAsin';
  if (!src.includes(anchor)) { console.error('variant-groups.ts 结尾锚点未找到'); process.exit(1); }
  src = src.replace(anchor, '\n' + block + '];\n\nconst groupsByAsin');
  fs.writeFileSync(file, src);
  console.log(`已更新 src/data/variant-groups.ts：重建 ${REBUILT.length} 组 + 新建 ${blocks.length - REBUILT.length} 组`);
}

/* ================= 产物 4：specs-overrides.ts ================= */
{
  const file = path.join(ROOT, 'src/data/specs-overrides.ts');
  let src = stripMarked(fs.readFileSync(file, 'utf8'));
  const lines = allNew.map((p) =>
    `  "${p.asin.toLowerCase()}": { material: ${JSON.stringify(p.material)}, dimensionsCm: [${p.dimsCm.join(', ')}] },`
  );
  const block = `  // >>> ${MARK}（bedding 规划 SKU 材质/尺寸，供卡片「布料+类型」标题与 PDP 标题区）\n${lines.join('\n')}\n  // <<< ${MARK}\n`;
  const idx = src.lastIndexOf('\n};');
  if (idx < 0) { console.error('specs-overrides.ts 结尾锚点未找到'); process.exit(1); }
  src = src.slice(0, idx) + block + src.slice(idx);
  fs.writeFileSync(file, src);
  console.log(`已更新 src/data/specs-overrides.ts：+${lines.length} 条目`);
}

/* ================= 产物 5：short-titles.ts ================= */
{
  const file = path.join(ROOT, 'src/data/short-titles.ts');
  let src = stripMarked(fs.readFileSync(file, 'utf8'));
  const lines = allNew.map((p) => `  "${p.asin.toLowerCase()}": ${JSON.stringify(p.shortTitle)},`);
  const block = `  // >>> ${MARK}（bedding 规划 SKU 短标题）\n${lines.join('\n')}\n  // <<< ${MARK}\n`;
  const idx = src.lastIndexOf('\n};');
  if (idx < 0) { console.error('short-titles.ts 结尾锚点未找到'); process.exit(1); }
  src = src.slice(0, idx) + block + src.slice(idx);
  fs.writeFileSync(file, src);
  console.log(`已更新 src/data/short-titles.ts：+${lines.length} 条目`);
}

/* ================= 汇总 ================= */
const counts = {};
for (const p of newProducts) counts[p.gid.replace(/.*-/, '')] = (counts[p.gid.replace(/.*-/, '')] || 0) + 1;
console.log('\n===== 汇总 =====');
console.log(`新建类型产品 ${newProducts.length}（Sheet Set ${counts.SHEETSET || 0} / Duvet Cover Set ${counts.DUVETSET || 0} / Duvet Cover ${counts.DUVET || 0} / Pillowcases ${counts.PC || 0}）+ 规划四件套 ${fourProducts.length} = ${allNew.length}`);
console.log(`跳过已存在 ${skippedExisting}`);
console.log(`变体组：重建 ${REBUILT.length}（${REBUILT.map((r) => r.id).join(', ')}），新建 ${groups.size - REBUILT.length}`);

})().catch((e) => { console.error(e); process.exit(1); });
