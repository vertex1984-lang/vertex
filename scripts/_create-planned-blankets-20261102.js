/**
 * _create-planned-blankets-20261102.js — 按 C:/Users/12021/Desktop/bedding-sku表.xlsx「Blanket」tab
 * 的 99 个毯子 SKU 创建规划产品（2026-11-02 用户定：图先缺省用占位图，只建类目信息，可重跑幂等）。
 *
 * 11 个供应链家族：
 *  1. 1001674506522 仿兔绒     6 色 × 8 尺寸 = 48  → 组 RABBIT-FUR     (ASIN RABBITFUR-*)
 *  2. 844024543701  塔芙绒拉链  3 色 × 2 尺寸 = 6   → 组 ZIP-FLEECE     (ASIN ZIPFLEECE-*)
 *  3. 963131507942  云杉绒杉影毯 4 色 × 3 尺寸 = 12 → 组 SPRUCE-FLEECE  (ASIN SPRUCE-*)
 *  4. 971279281151  华夫格绒    4 色 × 2 尺寸 = 8   → 组 WAFFLE-FLEECE  (ASIN WAFFLEFL-*)
 *  5. 989320962592  纤维       5 色 × 2 尺寸 = 10  → 组 989320962592
 *  6. 891678348176  纤维       2 色 × 2 尺寸 = 4   → 组 891678348176
 *  7. 1071513682043 纤维咖色    1                    → 单品成族
 *  8. 993952872570  纤维美拉德  1                    → 单品成族
 *  9. 1083252788246 纤维红色    1                    → 单品成族
 * 10. 897719548267  纤维       2 色 × 1 尺寸 = 2   → 组 897719548267
 * 11. 628822447872  纤维       3 色 × 2 尺寸 = 6   → 组 628822447872
 *
 * 输出（全部幂等，标记块 planned-blankets-20261102 可整体再生）：
 *  1. src/data/products-blankets-planned.ts（整体重写，price 0.00 / availableForSale false）
 *  2. src/data/materials-map.ts / variant-groups.ts / specs-overrides.ts / short-titles.ts（标记块）
 *  3. src/data/products.ts 合并 PLANNED_BLANKET_PRODUCTS（一次性插入，幂等）
 *  4. src/data/blanket-families.ts BLANKET_SECTIONS groupIds 注册（幂等）
 *  5. public/images/products/_planned/blanket-throw.webp（1200x1200 占位图，全 99 款共用）
 *
 * 用法: node scripts/_create-planned-blankets-20261102.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
sharp.cache({ files: 0 });

const ROOT = path.join(__dirname, '..');
const MARK = 'planned-blankets-20261102';
const PLACEHOLDER_URL = '/images/products/_planned/blanket-throw.webp';

/* ================= 家族定义 ================= */
// zhKey = xlsx N 列（供应链型号名）去空白/【】/（）后的匹配键
const FAMILIES = [
  {
    offer: '1001674506522', gid: 'RABBIT-FUR', asinPrefix: 'RABBITFUR', skuBase: 'rabbit-fur',
    handleBase: 'makimoo-faux-rabbit-fur-throw-blanket',
    short: 'Faux Rabbit Fur Throw Blanket',
    title: (s, c) => `Makimoo Faux Rabbit Fur Throw Blanket, Ultra Soft Plush Cozy Blanket for Couch Sofa and Bed, ${s} cm (${c})`,
    material: 'Faux Rabbit Fur (Polyester)',
    bullets: (s, c) =>
      `Ultra-Soft Faux Rabbit Fur: Dense, plush faux rabbit fur pile feels silky against the skin—cozy warmth without heaviness, made for everyday lounging.\n\n` +
      `Versatile Home Layer: Drape it over a sofa arm, layer it at the foot of the bed, or keep it close for reading and movie nights.\n\n` +
      `Size: Measuring ${s} cm, it works as a throw, nap blanket, or an extra cozy layer wherever you need it.\n\n` +
      `Quiet ${c} Tone: A calm, neutral palette that blends effortlessly with modern, minimalist, or cozy décor.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle; the plush pile stays soft wash after wash.`,
    colors: [
      { zh: '白色', slug: 'white', name: 'White' },
      { zh: '浅驼色', slug: 'camel', name: 'Light Camel' },
      { zh: '烟灰色', slug: 'smoke', name: 'Smoke Grey' },
      { zh: '樱花粉', slug: 'sakura', name: 'Sakura Pink' },
      { zh: '咖啡色', slug: 'coffee', name: 'Coffee Brown' },
      { zh: '浅灰色', slug: 'grey', name: 'Light Grey' },
    ],
    sizes: [[45, 45], [70, 100], [100, 160], [130, 160], [140, 200], [160, 200], [180, 200], [200, 230]],
  },
  {
    offer: '844024543701', gid: 'ZIP-FLEECE', asinPrefix: 'ZIPFLEECE', skuBase: 'zip-fleece',
    handleBase: 'makimoo-embossed-fleece-throw-blanket-with-zipper',
    short: 'Embossed Fleece Throw with Zipper',
    title: (s, c) => `Makimoo Embossed Fleece Throw Blanket with Zipper, Soft Removable Easy-Wash Blanket for Couch and Bed, ${s} cm (${c})`,
    material: 'Embossed Fleece (Polyester)',
    bullets: (s, c) =>
      `Embossed Fleece Texture: A soft embossed fleece surface adds quiet texture and cozy warmth for everyday use.\n\n` +
      `Zippered for Easy Washing: The hidden zipper lets you remove and wash the cover with ease—practical for daily family life.\n\n` +
      `Size: Measuring ${s} cm, it layers easily over a couch or bed.\n\n` +
      `Quiet ${c} Tone: A calm, neutral palette that blends effortlessly with modern, minimalist, or cozy décor.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle.`,
    colors: [
      { zh: '茶绿色', slug: 'teagreen', name: 'Tea Green' },
      { zh: '灰色', slug: 'grey', name: 'Grey' },
      { zh: '米白色', slug: 'ivory', name: 'Ivory White' },
    ],
    sizes: [[180, 200], [200, 230]],
  },
  {
    offer: '963131507942', gid: 'SPRUCE-FLEECE', asinPrefix: 'SPRUCE', skuBase: 'spruce-fleece',
    handleBase: 'makimoo-spruce-velvet-fleece-throw-blanket',
    short: 'Spruce Velvet Fleece Throw Blanket',
    title: (s, c) => `Makimoo Spruce Velvet Fleece Throw Blanket, Dense Soft Cozy Blanket for Couch Sofa and Bed, ${s} cm (${c})`,
    material: 'Velvet Fleece (Polyester)',
    bullets: (s, c) =>
      `Dense Velvet Fleece: Tightly woven velvet fleece feels plush and smooth—warm, cozy, and resistant to shedding.\n\n` +
      `Versatile Home Layer: Drape it over a sofa arm, layer it at the foot of the bed, or keep it close for reading and movie nights.\n\n` +
      `Size: Measuring ${s} cm, it works as a throw, nap blanket, or an extra cozy layer wherever you need it.\n\n` +
      `Quiet ${c} Tone: A calm, neutral palette that blends effortlessly with modern, minimalist, or cozy décor.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle; the dense pile stays soft wash after wash.`,
    colors: [
      { zh: '云杉绒杉影毯-奶白', slug: 'cream', name: 'Cream White' },
      { zh: '云杉绒杉影毯-绿', slug: 'green', name: 'Spruce Green' },
      { zh: '云杉绒杉影毯-咖啡', slug: 'coffee', name: 'Coffee Brown' },
      { zh: '云杉绒杉影毯-卡其', slug: 'khaki', name: 'Khaki' },
    ],
    sizes: [[150, 200], [180, 200], [200, 230]],
  },
  {
    offer: '971279281151', gid: 'WAFFLE-FLEECE', asinPrefix: 'WAFFLEFL', skuBase: 'waffle-fleece',
    handleBase: 'makimoo-waffle-fleece-throw-blanket',
    short: 'Waffle Fleece Throw Blanket',
    title: (s, c) => `Makimoo Waffle Fleece Throw Blanket, Soft Textured Four-Season Blanket for Couch Sofa and Bed, ${s} cm (${c})`,
    material: 'Waffle Fleece (Polyester)',
    bullets: (s, c) =>
      `Waffle Fleece Texture: A soft waffle-textured fleece—light, cozy, and touchable, comfortable across all four seasons.\n\n` +
      `Versatile Home Layer: Drape it over a sofa arm, layer it at the foot of the bed, or keep it close for reading and movie nights.\n\n` +
      `Size: Measuring ${s} cm, it works as a throw, nap blanket, or an extra cozy layer wherever you need it.\n\n` +
      `Quiet ${c} Tone: A calm, neutral palette that blends effortlessly with modern, minimalist, or cozy décor.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle.`,
    colors: [
      { zh: '乳白咖', slug: 'latte', name: 'Cream Latte' },
      { zh: '米灰', slug: 'greige', name: 'Greige' },
      { zh: '淡紫', slug: 'lilac', name: 'Lilac' },
      { zh: '裸粉', slug: 'nude', name: 'Nude Pink' },
    ],
    sizes: [[150, 200], [200, 230]],
  },
  // ── 纤维杂项（名称从简，上站前再按实拍定稿） ──
  {
    offer: '989320962592', gid: '989320962592', asinPrefix: '989320962592', skuBase: 'throw-989320962592',
    handleBase: 'makimoo-soft-throw-blanket-989320962592',
    short: 'Soft Throw Blanket',
    title: (s, c) => `Makimoo Soft Throw Blanket, Lightweight Decorative Blanket for Couch Sofa and Bed, ${s} cm (${c})`,
    material: 'Polyester',
    bullets: (s, c) =>
      `Soft Everyday Throw: A soft, lightweight blanket for daily lounging—easy to drape, fold, and carry from room to room.\n\n` +
      `Size: Measuring ${s} cm, it works as a sofa throw, nap blanket, or an extra layer at the foot of the bed.\n\n` +
      `Quiet ${c} Tone: A calm, neutral palette that blends effortlessly with modern, minimalist, or cozy décor.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle.`,
    colors: [
      { zh: '卡其色', slug: 'khaki', name: 'Khaki' },
      { zh: '浅灰', slug: 'grey', name: 'Light Grey' },
      { zh: '米色', slug: 'beige', name: 'Beige' },
      { zh: '薄荷绿', slug: 'mint', name: 'Mint Green' },
      { zh: '蓝色', slug: 'blue', name: 'Blue' },
    ],
    sizes: [[127, 180], [130, 230]],
  },
  {
    offer: '891678348176', gid: '891678348176', asinPrefix: '891678348176', skuBase: 'throw-891678348176',
    handleBase: 'makimoo-soft-throw-blanket-891678348176',
    short: 'Soft Throw Blanket',
    title: (s, c) => `Makimoo Soft Throw Blanket, Lightweight Decorative Blanket for Couch Sofa and Bed, ${s} cm (${c})`,
    material: 'Polyester',
    bullets: (s, c) =>
      `Soft Everyday Throw: A soft, lightweight blanket for daily lounging—easy to drape, fold, and carry from room to room.\n\n` +
      `Size: Measuring ${s} cm, it works as a sofa throw, nap blanket, or an extra layer at the foot of the bed.\n\n` +
      `Quiet ${c} Tone: A calm, neutral palette that blends effortlessly with modern, minimalist, or cozy décor.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle.`,
    colors: [
      { zh: '燕麦白', slug: 'oat', name: 'Oat White' },
      { zh: '乌克丽丽', slug: 'ukulele', name: 'Ukulele' },
    ],
    sizes: [[130, 170], [150, 220]],
  },
  {
    offer: '1071513682043', gid: null, asinPrefix: '1071513682043', skuBase: 'throw-1071513682043',
    handleBase: 'makimoo-soft-throw-blanket-1071513682043',
    short: 'Soft Throw Blanket',
    title: (s, c) => `Makimoo Soft Throw Blanket, Lightweight Decorative Blanket for Couch Sofa and Bed, ${s} cm (${c})`,
    material: 'Polyester',
    bullets: (s, c) =>
      `Soft Everyday Throw: A soft, lightweight blanket for daily lounging—easy to drape, fold, and carry from room to room.\n\n` +
      `Size: Measuring ${s} cm, it works as a sofa throw, nap blanket, or an extra layer at the foot of the bed.\n\n` +
      `Quiet ${c} Tone: A calm, neutral palette that blends effortlessly with modern, minimalist, or cozy décor.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle.`,
    colors: [{ zh: '咖色', slug: 'coffee', name: 'Coffee' }],
    sizes: [[120, 160]],
  },
  {
    offer: '993952872570', gid: null, asinPrefix: '993952872570', skuBase: 'throw-993952872570',
    handleBase: 'makimoo-soft-throw-blanket-993952872570',
    short: 'Soft Throw Blanket',
    title: (s, c) => `Makimoo Soft Throw Blanket, Lightweight Decorative Blanket for Couch Sofa and Bed, ${s} cm (${c})`,
    material: 'Polyester',
    bullets: (s, c) =>
      `Soft Everyday Throw: A soft, lightweight blanket for daily lounging—easy to drape, fold, and carry from room to room.\n\n` +
      `Size: Measuring ${s} cm, it works as a sofa throw, nap blanket, or an extra layer at the foot of the bed.\n\n` +
      `Quiet ${c} Tone: A calm, neutral palette that blends effortlessly with modern, minimalist, or cozy décor.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle.`,
    colors: [{ zh: '美拉德', slug: 'maillard', name: 'Maillard Brown' }],
    sizes: [[130, 160]],
  },
  {
    offer: '1083252788246', gid: null, asinPrefix: '1083252788246', skuBase: 'throw-1083252788246',
    handleBase: 'makimoo-soft-throw-blanket-1083252788246',
    short: 'Soft Throw Blanket',
    title: (s, c) => `Makimoo Soft Throw Blanket, Lightweight Decorative Blanket for Couch Sofa and Bed, ${s} cm (${c})`,
    material: 'Polyester',
    bullets: (s, c) =>
      `Soft Everyday Throw: A soft, lightweight blanket for daily lounging—easy to drape, fold, and carry from room to room.\n\n` +
      `Size: Measuring ${s} cm, it works as a sofa throw, nap blanket, or an extra layer at the foot of the bed.\n\n` +
      `Quiet ${c} Tone: A calm, neutral palette that blends effortlessly with modern, minimalist, or cozy décor.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle.`,
    colors: [{ zh: '红色', slug: 'red', name: 'Red' }],
    sizes: [[120, 160]],
  },
  {
    offer: '897719548267', gid: '897719548267', asinPrefix: '897719548267', skuBase: 'throw-897719548267',
    handleBase: 'makimoo-soft-throw-blanket-897719548267',
    short: 'Soft Throw Blanket',
    title: (s, c) => `Makimoo Soft Throw Blanket, Lightweight Decorative Blanket for Couch Sofa and Bed, ${s} cm (${c})`,
    material: 'Polyester',
    bullets: (s, c) =>
      `Soft Everyday Throw: A soft, lightweight blanket for daily lounging—easy to drape, fold, and carry from room to room.\n\n` +
      `Size: Measuring ${s} cm, it works as a sofa throw, nap blanket, or an extra layer at the foot of the bed.\n\n` +
      `Quiet ${c} Tone: A calm, neutral palette that blends effortlessly with modern, minimalist, or cozy décor.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle.`,
    colors: [
      { zh: '苍苍', slug: 'mist', name: 'Mist Grey' },
      { zh: '米色', slug: 'beige', name: 'Beige' },
    ],
    sizes: [[130, 170]],
  },
  {
    offer: '628822447872', gid: '628822447872', asinPrefix: '628822447872', skuBase: 'throw-628822447872',
    handleBase: 'makimoo-soft-throw-blanket-628822447872',
    short: 'Soft Throw Blanket',
    title: (s, c) => `Makimoo Soft Throw Blanket, Lightweight Decorative Blanket for Couch Sofa and Bed, ${s} cm (${c})`,
    material: 'Polyester',
    bullets: (s, c) =>
      `Soft Everyday Throw: A soft, lightweight blanket for daily lounging—easy to drape, fold, and carry from room to room.\n\n` +
      `Size: Measuring ${s} cm, it works as a sofa throw, nap blanket, or an extra layer at the foot of the bed.\n\n` +
      `Quiet ${c} Tone: A calm, neutral palette that blends effortlessly with modern, minimalist, or cozy décor.\n\n` +
      `Easy Everyday Care: Machine washable on a gentle cycle.`,
    colors: [
      { zh: '米色', slug: 'beige', name: 'Beige' },
      { zh: '卡其', slug: 'khaki', name: 'Khaki' },
      { zh: '深灰', slug: 'darkgrey', name: 'Dark Grey' },
    ],
    sizes: [[127, 178], [130, 240]],
  },
];

/* ================= 展开为产品列表 ================= */
const products = [];
for (const f of FAMILIES) {
  for (const c of f.colors) {
    for (const [w, h] of f.sizes) {
      const sizeStr = `${w} x ${h}`;
      const sizeSeg = `${w}X${h}`;
      const asin = `${f.asinPrefix}-${c.slug.toUpperCase()}-${sizeSeg}`;
      products.push({
        family: f,
        offer: f.offer,
        gid: f.gid,
        zhKey: c.zh,
        color: c.name,
        dims: [w, h],
        asin,
        asinLower: asin.toLowerCase(),
        title: f.title(sizeStr, c.name),
        shortTitle: `${f.short}, ${c.name}`,
        handle: `${f.handleBase}-${c.slug}-${w}x${h}`,
        sku: `${f.skuBase}-${c.slug}-${w}x${h}`,
        sizeCm: `${sizeStr} cm`,
        bullets: f.bullets(sizeStr, c.name),
      });
    }
  }
}
// 幂等自检：handle/asin/sku 各自不得重复
{
  const asins = new Set(), handles = new Set(), skus = new Set();
  for (const p of products) {
    if (asins.has(p.asinLower)) { console.error('重复 asin: ' + p.asinLower); process.exit(1); }
    if (handles.has(p.handle)) { console.error('重复 handle: ' + p.handle); process.exit(1); }
    if (skus.has(p.sku)) { console.error('重复 sku: ' + p.sku); process.exit(1); }
    asins.add(p.asinLower); handles.add(p.handle); skus.add(p.sku);
  }
}
console.log(`产品数: ${products.length}`);

(async () => {

/* ================= 1. products-blankets-planned.ts（整体重写） ================= */
{
  const entries = products.map((p) => {
    const descParas = p.bullets.split('\n\n');
    return {
      id: `makimoo-${p.asin}`,
      asin: p.asin,
      title: p.title,
      handle: p.handle,
      description: descParas.join(' '),
      descriptionHtml: descParas.map((x) => `<p>${x}</p>`).join(''),
      productType: 'Blankets',
      tags: ['Blankets'],
      availableForSale: false,
      images: [{ url: PLACEHOLDER_URL, altText: p.title, width: 1200, height: 1200 }],
      priceRange: { minVariantPrice: { amount: '0.00', currencyCode: 'USD' } },
      variants: [
        {
          id: `variant-${p.asin}`,
          title: 'Default Title',
          price: { amount: '0.00', currencyCode: 'USD' },
          availableForSale: false,
          selectedOptions: [],
        },
      ],
      amazonUrl: '',
    };
  });
  const body =
    `/**\n * AUTO-GENERATED by scripts/_create-planned-blankets-20261102.js — 重跑脚本可整体再生成，手工修改会被覆盖。\n` +
    ` * 2026-11-02 用户定：bedding-sku表.xlsx「Blanket」tab 的 99 个毯子规划 SKU（11 个供应链家族），\n` +
    ` * 全部 price 0.00 / availableForSale false（Coming Soon），图先缺省统一用占位图 ${PLACEHOLDER_URL}，\n` +
    ` * 后续实拍图生成后逐族替换；Shopify 建品后由 build-shopify-map 接上价格/库存。\n */\n` +
    `import type { MakimooProduct } from './products';\n\n` +
    `export const PLANNED_BLANKET_PRODUCTS: MakimooProduct[] = [\n` +
    entries.map((e) => JSON.stringify(e, null, 2)).join(',\n') +
    `,\n];\n`;
  fs.writeFileSync(path.join(ROOT, 'src/data/products-blankets-planned.ts'), body, 'utf8');
  console.log(`products-blankets-planned.ts: ${entries.length} entries`);
}

/* ================= 标记块工具 ================= */
function replaceMarked(file, anchor, block, eol = '\n') {
  let s = fs.readFileSync(file, 'utf8');
  const re = new RegExp(`\\n?[ \\t]*// >>> ${MARK} >>>[\\s\\S]*?// <<< ${MARK} <<<\\r?\\n?`);
  s = s.replace(re, eol === '\r' ? '' : '');
  const idx = anchor(s);
  if (idx < 0) { console.error(`anchor not found: ${file}`); process.exit(1); }
  s = s.slice(0, idx) + block + s.slice(idx);
  fs.writeFileSync(file, s, 'utf8');
}

/* ================= 2. materials-map.ts ================= */
{
  const file = path.join(ROOT, 'src/data/materials-map.ts');
  const lines = products.map((p) => {
    const entry = { title: p.title, bullets: p.bullets, sku: p.sku, images: [PLACEHOLDER_URL], whiteBg: [false] };
    return `  "${p.asinLower}": ${JSON.stringify(entry)},`;
  });
  // 锚点：MATERIALS_MAP 的收尾 `  };`（在 SITE_ONLY_WHITEBG 之前最后一个 `};`）——
  // MATERIALS_MAP 以缩进的 "  };" 结束，不能用 indexOf('\n};')（会落进 SITE_ONLY_WHITEBG）
  const block = `  // >>> ${MARK} >>>\n${lines.join('\n')}\n  // <<< ${MARK} <<<\n`;
  replaceMarked(file, (s) => {
    const si = s.indexOf('export const SITE_ONLY_WHITEBG');
    if (si < 0) return -1;
    const close = s.lastIndexOf('};', si);
    return close < 0 ? -1 : s.lastIndexOf('\n', close) + 1;
  }, block);
  console.log(`materials-map.ts: ${lines.length} entries`);
}

/* ================= 3. variant-groups.ts（lone-\r 行尾） ================= */
{
  const file = path.join(ROOT, 'src/data/variant-groups.ts');
  const groups = new Map();
  for (const p of products) {
    if (!p.gid) continue;
    if (!groups.has(p.gid)) groups.set(p.gid, []);
    groups.get(p.gid).push(p);
  }
  const blocks = [];
  for (const [gid, members] of groups) {
    // 成员顺序：颜色注册序 × 尺寸从小到大（rep 取中位尺寸）
    const memLines = members
      .map((p) => `    { asin: '${p.asinLower}', handle: '${p.handle}', color: '${p.color}', size: '${p.sizeCm}' },`)
      .join('\r');
    blocks.push(
      `  {\r` +
      `    id: '${gid}',\r` +
      `    optionName: 'Color',\r` +
      `    // ${MARK}：规划毯子（图缺省，Coming Soon）\r` +
      `    members: [\r${memLines}\r    ],\r` +
      `  },\r`
    );
  }
  const block = `  // >>> ${MARK} >>>\r` + blocks.join('') + `  // <<< ${MARK} <<<\r`;
  // 锚点：VARIANT_GROUPS 数组的收尾 `];`（const groupsByAsin 之前最后一个]，不能用全文件 lastIndexOf——
  // 文件尾 isVariantColorHidden 里 HIDDEN_VARIANT_COLORS[groupId]; 也含 "];"，曾误插进函数体）
  replaceMarked(file, (s) => {
    const gi = s.indexOf('const groupsByAsin');
    return gi < 0 ? -1 : s.lastIndexOf('];', gi);
  }, block, '\r');
  console.log(`variant-groups.ts: ${groups.size} groups`);
}

/* ================= 4. specs-overrides.ts ================= */
{
  const file = path.join(ROOT, 'src/data/specs-overrides.ts');
  const lines = products.map(
    (p) => `  "${p.asinLower}": { material: "${p.family.material}", dimensionsCm: [${p.dims.join(', ')}] },`
  );
  const block = `  // >>> ${MARK} >>>\n${lines.join('\n')}\n  // <<< ${MARK} <<<\n`;
  replaceMarked(file, (s) => s.lastIndexOf('};'), block);
  console.log(`specs-overrides.ts: ${lines.length} entries`);
}

/* ================= 5. short-titles.ts ================= */
{
  const file = path.join(ROOT, 'src/data/short-titles.ts');
  const lines = products.map((p) => `  "${p.asinLower}": ${JSON.stringify(p.shortTitle)},`);
  const block = `  // >>> ${MARK} >>>\n${lines.join('\n')}\n  // <<< ${MARK} <<<\n`;
  replaceMarked(file, (s) => s.lastIndexOf('};'), block);
  console.log(`short-titles.ts: ${lines.length} entries`);
}

/* ================= 6. products.ts 合并（幂等） ================= */
{
  const file = path.join(ROOT, 'src/data/products.ts');
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes('products-blankets-planned')) {
    s = s.replace(
      "import { PLANNED_PRODUCTS } from './products-planned';",
      "import { PLANNED_PRODUCTS } from './products-planned';\nimport { PLANNED_BLANKET_PRODUCTS } from './products-blankets-planned';"
    );
    s = s.replace(
      '[...BASE_PRODUCTS, ...MATERIALS_PRODUCTS, ...PLANNED_PRODUCTS]',
      '[...BASE_PRODUCTS, ...MATERIALS_PRODUCTS, ...PLANNED_PRODUCTS, ...PLANNED_BLANKET_PRODUCTS]'
    );
    if (!s.includes('PLANNED_BLANKET_PRODUCTS')) { console.error('products.ts 合并失败'); process.exit(1); }
    fs.writeFileSync(file, s, 'utf8');
    console.log('products.ts: 合并 PLANNED_BLANKET_PRODUCTS');
  } else {
    console.log('products.ts: 已合并，跳过');
  }
}

/* ================= 7. blanket-families.ts 分区注册（幂等） ================= */
{
  const file = path.join(ROOT, 'src/data/blanket-families.ts');
  let s = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (!s.includes("'RABBIT-FUR'")) {
    s = s.replace(
      "groupIds: ['969627065032'],",
      "groupIds: ['969627065032', 'RABBIT-FUR', 'ZIP-FLEECE', 'SPRUCE-FLEECE', 'WAFFLE-FLEECE'],"
    );
    changed = true;
  }
  if (!s.includes("'989320962592'")) {
    s = s.replace(
      "groupIds: ['KNIT-THROW', 'BOHO-THROW', 'JAC-THROW', 'CHUNKY-THROW'],",
      "groupIds: ['KNIT-THROW', 'BOHO-THROW', 'JAC-THROW', 'CHUNKY-THROW', '989320962592', '891678348176', '897719548267', '628822447872'],"
    );
    changed = true;
  }
  if (changed) { fs.writeFileSync(file, s, 'utf8'); console.log('blanket-families.ts: 分区 groupIds 已注册'); }
  else console.log('blanket-families.ts: 已注册，跳过');
}

/* ================= 8. 占位图（1200x1200 webp，暖白底 + Coming Soon） ================= */
{
  const out = path.join(ROOT, 'public', PLACEHOLDER_URL);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (!fs.existsSync(out)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200">
  <rect width="1200" height="1200" fill="#F5F1EA"/>
  <text x="600" y="600" font-family="Georgia, serif" font-size="44" letter-spacing="6" fill="#C4B9AA" text-anchor="middle" dominant-baseline="middle">COMING SOON</text>
</svg>`;
    await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(out + '.tmp');
    fs.renameSync(out + '.tmp', out);
    console.log('占位图已生成: ' + PLACEHOLDER_URL);
  } else console.log('占位图已存在，跳过');
}

/* ================= 9. 导出行映射供回填脚本使用 ================= */
{
  const rows = products.map((p) => ({
    offer: p.offer, zhKey: p.zhKey, size: `${p.dims[0]}x${p.dims[1]}cm`,
    asin: p.asin, handle: p.handle, sku: p.sku, title: p.title, material: p.family.material,
    color: p.color, gid: p.gid,
  }));
  fs.mkdirSync(path.join(ROOT, 'scripts/_shots'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'scripts/_shots/planned-blankets-20261102.json'), JSON.stringify(rows, null, 2), 'utf8');
  console.log('行映射已导出: scripts/_shots/planned-blankets-20261102.json');
}

console.log('全部完成');
})().catch((e) => { console.error('失败:', e); process.exit(1); });
