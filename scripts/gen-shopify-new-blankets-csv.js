/**
 * gen-shopify-new-blankets-csv.js — 三个新毯子系列 Shopify 批量导入 CSV（2026-10-19）
 * 与 add-throw-3-series.js 的 ASIN/SKU 口径一致（SKU = <series>-throw-<color>-<size>，
 * Shopify 侧靠 SKU 与本地 materials-map 兜底关联，同 blanket2/sateen 惯例）。
 * 定价占位 $29.99（用户后续调价）；图片引用线上 URL：
 *   https://www.makimoohome.com/images/products/<ASIN>/1.webp 和 2.webp
 *   ——图片需先部署到线上 Shopify 才能拉到，先推送网站再导入。
 * 重量：JACTHROW 用实际克重（850/1050/700g）；BOHOTHROW/CHUNKYTHROW 为占位估值（600/900、900/1300g），待用户核实。
 * KNITTHROW 不在此 CSV（已在 Shopify）。
 * 输出：C:/Users/12021/Desktop/makimoo-new-blankets.csv
 * 用法: node scripts/gen-shopify-new-blankets-csv.js
 */
const fs = require('fs');

const PRICE = '29.99'; // 2026-10-19 用户定（占位）

const SERIES = [
  {
    skuPrefix: 'boho-throw',
    asinPrefix: 'BOHOTHROW',
    grams: { '127': 600, '130': 900 }, // 占位估值
    tagWord: 'Boho Chevron',
    colors: [
      { slug: 'sunset', name: 'Sunset' },
      { slug: 'olive', name: 'Khaki Olive' },
      { slug: 'teal', name: 'Teal Blue' },
      { slug: 'burgundy', name: 'Burgundy' },
    ],
    sizes: [
      { suffix: '127', in: '50 x 71 in', cm: '127 x 180 cm' },
      { suffix: '130', in: '51 x 91 in', cm: '130 x 230 cm' },
    ],
    title: (c, s) => `Makimoo Bohemian Chevron Knit Throw Blanket with Tassels, Soft Lightweight Acrylic Decorative Blanket for Couch Sofa and Bed, ${s.in} (${c.name})`,
    readable: (c, s) => `Makimoo Bohemian Chevron Knit Throw Blanket with Tassels ${s.in} (${c.name})`,
    seoDesc: (c, s) => `Bohemian chevron knit throw blanket in ${c.name}, ${s.in} with tassels. Soft lightweight acrylic, zigzag stripes. Machine washable.`,
    bullets: (c, s) => [
      'Bohemian Chevron Design: Bold zigzag chevron stripes in warm, earthy tones give this throw its free-spirited boho character, finished with hand-knotted tassels on both ends for an artisan touch.',
      'Soft Acrylic Knit: Knitted from soft, lightweight acrylic yarn, the blanket feels gentle and cozy without bulk—comfortable across all four seasons, from cool summer evenings to winter layering.',
      `Generous Size with Tassels: Measuring ${s.in} (${s.cm}) including the tassel fringe, it drapes beautifully over a sofa arm, across the foot of a bed, or around your shoulders on a cool evening.`,
      `Versatile Boho Accent: The ${c.name} palette pairs effortlessly with bohemian, farmhouse, or eclectic décor—use it as a couch throw, bed-end blanket, reading-nook wrap, or picnic companion.`,
      'Easy Everyday Care: Machine washable on a gentle cycle; the knit keeps its color and texture wash after wash, and the tassels stay neat with a quick reshape while damp.',
    ],
  },
  {
    skuPrefix: 'jac-throw',
    asinPrefix: 'JACTHROW',
    grams: { '130x180': 850, '150x200': 1050, '130x190': 700 }, // 实际克重
    tagWord: 'Nordic Jacquard',
    colors: [
      { slug: 'hb-black', name: 'Herringbone Black White', pattern: 'classic herringbone pattern in black and white' },
      { slug: 'hb-khaki', name: 'Herringbone Camel', pattern: 'classic herringbone pattern in warm camel tones' },
      { slug: 'paisley-beige', name: 'Paisley Khaki', pattern: 'elegant paisley motif in soft khaki tones' },
      { slug: 'paisley-blue', name: 'Paisley Dusty Blue', pattern: 'elegant paisley motif in dusty blue tones' },
    ],
    sizes: [
      { suffix: '130x180', cm: '130 x 180 cm', g: 850 },
      { suffix: '150x200', cm: '150 x 200 cm', g: 1050 },
      { suffix: '130x190', cm: '130 x 190 cm', g: 700 },
    ],
    title: (c, s) => `Makimoo Jacquard Knit Throw Blanket, Lightweight Nordic Decorative Blanket for Couch Sofa Travel and Office Nap, ${s.cm} ${s.g}g (${c.name})`,
    readable: (c, s) => `Makimoo Jacquard Knit Throw Blanket Nordic ${s.cm} (${c.name})`,
    seoDesc: (c, s) => `Nordic jacquard knit throw blanket in ${c.name}, ${s.cm} (${s.g}g). Lightweight acrylic, woven pattern, clean edge, no tassels. Machine washable.`,
    bullets: (c, s) => [
      `Nordic Jacquard Pattern: The ${c.pattern} is woven directly into the knit—not printed—so the design stays crisp wash after wash, framed by a clean knitted edge with no tassels for a sleek, modern finish.`,
      `Lightweight Acrylic Jacquard Knit: Woven from soft acrylic yarn (${s.g}g), this blanket is light enough to carry from couch to office yet warm enough for an afternoon nap or a chilly commute.`,
      `Practical Throw Size: Measuring ${s.cm}, it covers your shoulders and legs comfortably—ideal as a sofa throw, travel blanket, office nap blanket, or an extra layer at the foot of the bed.`,
      `Quiet Nordic Accent: The ${c.name} tones blend effortlessly with modern, Scandinavian, or minimalist décor—drape it over an armchair, fold it across the bed end, or keep it in the car for road trips.`,
      'Easy Everyday Care: Machine washable on a gentle cycle; the jacquard knit holds its pattern and shape wash after wash—no fringe to tangle, no fuss.',
    ],
  },
  {
    skuPrefix: 'chunky-throw',
    asinPrefix: 'CHUNKYTHROW',
    grams: { '127': 900, '130': 1300 }, // 占位估值
    tagWord: 'Chunky Knit',
    colors: [
      { slug: 'orange', name: 'Burnt Orange' },
      { slug: 'oat', name: 'Khaki Oat' },
      { slug: 'cream', name: 'Cream White' },
      { slug: 'grey', name: 'Light Grey' },
    ],
    sizes: [
      { suffix: '127', in: '50 x 68 in', cm: '127 x 172 cm' },
      { suffix: '130', in: '51 x 91 in', cm: '130 x 230 cm' },
    ],
    title: (c, s) => `Makimoo Chunky Knit Throw Blanket with Tassels, Soft Textured Decorative Blanket for Couch Sofa and Bed End, ${s.in} (${c.name})`,
    readable: (c, s) => `Makimoo Chunky Knit Throw Blanket with Tassels ${s.in} (${c.name})`,
    seoDesc: (c, s) => `Chunky knit throw blanket in ${c.name}, ${s.in} with long tassels. Soft textured bobble knit, cozy acrylic. Machine washable.`,
    bullets: (c, s) => [
      'Chunky Bobble Knit Texture: Plump, popcorn-style bobble stitches give this throw its rich, touchable texture, finished with long hand-tied tassels on both ends for a cozy, handcrafted look.',
      'Soft Chunky Acrylic Knit: Knitted from thick yet soft acrylic yarn, the blanket feels plush and warm without heavy weight—perfect for snuggling on the couch through every season.',
      `Generous Size with Tassels: Measuring ${s.in} (${s.cm}) including the long tassel fringe, it layers beautifully across the foot of a bed or over the back of a sofa.`,
      `Versatile Cozy Accent: The ${c.name} tone and chunky texture pair effortlessly with modern, farmhouse, or Scandinavian décor—use it as a couch throw, bed-end runner, or reading companion.`,
      'Easy Everyday Care: Machine washable on a gentle cycle and dry flat; the chunky knit keeps its loft and the tassels stay neat with a quick reshape while damp.',
    ],
  },
];

const HEADER = [
  'Title', 'URL handle', 'Description', 'Vendor', 'Product category', 'Type', 'Tags',
  'Published on online store', 'Status', 'SKU', 'Variant Barcodes',
  'Option1 name', 'Option1 value', 'Option1 Linked To',
  'Option2 name', 'Option2 value', 'Option2 Linked To',
  'Option3 name', 'Option3 value', 'Option3 Linked To',
  'Price', 'Compare-at price', 'Cost per item', 'Charge tax', 'Tax code',
  'Unit price total measure', 'Unit price total measure unit', 'Unit price base measure', 'Unit price base measure unit',
  'Inventory tracker', 'Inventory quantity', 'Continue selling when out of stock',
  'Weight value (grams)', 'Weight unit for display', 'Requires shipping', 'Fulfillment service',
  'Product image URL', 'Image position', 'Image alt text', 'Variant image URL',
  'Gift card', 'SEO title', 'SEO description',
  'Color (product.metafields.shopify.color-pattern)',
  'Google Shopping / Google product category', 'Google Shopping / Gender', 'Google Shopping / Age group',
  'Google Shopping / Manufacturer part number (MPN)', 'Google Shopping / Ad group name', 'Google Shopping / Ads labels',
  'Google Shopping / Condition', 'Google Shopping / Custom product',
  'Google Shopping / Custom label 0', 'Google Shopping / Custom label 1', 'Google Shopping / Custom label 2',
  'Google Shopping / Custom label 3', 'Google Shopping / Custom label 4',
  'Packed product length', 'Packed product width', 'Packed product height', 'Packed product dimension unit',
];

const q = (v) => {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

const rows = [];
let count = 0;
for (const sr of SERIES) {
  for (const c of sr.colors) {
    for (const s of sr.sizes) {
      const sku = `${sr.skuPrefix}-${c.slug}-${s.suffix}`;
      const asin = `${sr.asinPrefix}-${c.slug.toUpperCase()}-${s.suffix.toUpperCase()}`;
      const img1 = `https://www.makimoohome.com/images/products/${asin}/1.webp`;
      const img2 = `https://www.makimoohome.com/images/products/${asin}/2.webp`;
      const readableTitle = sr.readable(c, s);
      const descHtml = sr.bullets(c, s).map((p) => `<p>${p}</p>`).join('');
      // 主行：完整数据 + 图 1
      rows.push([
        sku, // Title（标题用 SKU，同 blanket2/sateen 惯例）
        sku, // URL handle
        descHtml, // Description
        'Makimoo', // Vendor
        'Home & Garden > Linens & Bedding > Blankets & Throws', // Product category
        'Blankets', // Type
        `Blankets, Throw Blanket, Knit, Acrylic, ${sr.tagWord}, ${c.name}`, // Tags
        'TRUE', // Published on online store
        'Active', // Status
        sku, // SKU
        '', // Variant Barcodes
        'Title', 'Default Title', '', // Option1
        '', '', '', // Option2
        '', '', '', // Option3
        PRICE, '', '', 'TRUE', '', // Price / Compare-at / Cost / Charge tax / Tax code
        '', '', '', '', // Unit price
        'shopify', '100', 'DENY', // Inventory
        String(sr.grams[s.suffix]), 'g', 'TRUE', 'manual', // Weight / shipping
        img1, '1', readableTitle, img1, // Images
        'FALSE', // Gift card
        readableTitle, sr.seoDesc(c, s), // SEO
        '', // Color metafield 留空（metaobject 引用，纯文本会校验失败，同 blanket2 惯例）
        '', '', '', '', '', '', 'New', 'FALSE', // Google Shopping
        '', '', '', '', '', // Custom labels
        '', '', '', '', // Packed dims
      ].map(q).join(','));
      // 次行：仅 handle + 图 2（Shopify CSV 多图标准写法）
      const extra = new Array(HEADER.length).fill('');
      extra[1] = sku; // URL handle
      extra[36] = img2; // Product image URL
      extra[37] = '2'; // Image position
      extra[38] = `${readableTitle} (flat lay)`; // Image alt text
      rows.push(extra.map(q).join(','));
      count++;
    }
  }
}

const out = 'C:/Users/12021/Desktop/makimoo-new-blankets.csv';
try {
  fs.writeFileSync(out, '﻿' + HEADER.map(q).join(',') + '\r\n' + rows.join('\r\n') + '\r\n', 'utf8');
  console.log(`已生成 ${out}（${count} 个 SKU，${rows.length} 行，含图 1/2 URL）`);
} catch (e) {
  console.error(`写入失败 ${out}：${e.code || e.message}（如在 Excel 中打开请先关闭）`);
  process.exit(1);
}
