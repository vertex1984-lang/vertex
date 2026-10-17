/**
 * gen-shopify-duvset-csv.js — 生成 DUVSET 四新色 Shopify 批量导入 CSV（2026-10-17）
 * 16 个独立产品（4 色 × 4 尺寸），与 add-duvset-4colors.js 的 ASIN/SKU 口径一致：
 *   SKU = duvset-<color>-<size>（Shopify 侧靠 SKU 与本地 materials-map 兜底关联）
 * 定价/重量沿用 DUVSET 既有成员口径（shopify-map.ts）：价格全尺寸 $19.99；
 *   重量 twin 0.9 / full 1.05 / queen 1.15 / king 1.3 kg。
 * 图片引用线上 URL：https://www.makimoohome.com/images/products/DUVSET-<COLOR>-<SIZE>/1.webp
 *   ——注意：图片需先部署到线上 Shopify 才能拉到，先推送网站再导入（或先用 -noimg 版建品）
 * 输出：C:/Users/12021/Desktop/makimoo-duvset-16.csv（+ -noimg 备份版）
 * 用法: node scripts/gen-shopify-duvset-csv.js
 */
const fs = require('fs');

const COLORS = [
  { slug: 'beanred', name: 'Bean Red' },
  { slug: 'butter', name: 'Butter Yellow' },
  { slug: 'dill', name: 'Dill Green' },
  { slug: 'oat', name: 'Alpine Oat' },
];
const SIZES = [
  { key: 'twin', name: 'Twin', inch: '88" x 68"', pc: '20" x 26"', price: '19.99', grams: 900 },
  { key: 'full', name: 'Full', inch: '88" x 80"', pc: '20" x 26"', price: '19.99', grams: 1050 },
  { key: 'queen', name: 'Queen', inch: '88" x 88"', pc: '20" x 30"', price: '19.99', grams: 1150 },
  { key: 'king', name: 'King', inch: '90" x 104"', pc: '20" x 36"', price: '19.99', grams: 1300 },
];

const bullets = (colorName, s) => [
  'Luxuriously Soft Fabric: Crafted from premium brushed cotton-like fabric that feels gentle against skin, this breathable duvet cover set offers a cozy, lightweight sleep surface suitable for year-round comfort.',
  'Secure Zipper Closure & Corner Ties: The hidden zipper design keeps your comforter neatly tucked in, while interior corner ties help prevent shifting and bunching for a smooth, tidy bed every night.',
  `Complete ${s.name} 3-Piece Set: This bedding set includes 1 duvet cover (${s.inch.replace(/"/g, '"')}) and 2 pillowcases (${s.pc}), providing a coordinated, hotel-inspired look for your bedroom.`,
  'Wrinkle Resistant & Easy Care: The durable fabric resists wrinkles and fading, machine washes easily, and dries quickly, saving you time while maintaining a fresh, inviting appearance.',
  `Warm Healing Tone: The muted ${colorName} shade brings a calm, cozy feel to the bedroom and blends effortlessly with modern, classic, or neutral décor.`,
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

function row(c, s, withImg) {
  const sku = `duvset-${c.slug}-${s.key}`;
  const asin = `DUVSET-${c.slug.toUpperCase()}-${s.key.toUpperCase()}`;
  const readableTitle = `Makimoo ${s.name} Duvet Cover Set 3 Piece Soft Brushed Cotton-Like (${c.name})`;
  const imgUrl = `https://www.makimoohome.com/images/products/${asin}/1.webp`;
  const descHtml = bullets(c.name, s).map((p) => `<p>${p}</p>`).join('');
  const seoDesc = `${s.name} 3-piece duvet cover set in muted ${c.name}. Soft brushed cotton-like fabric, hidden zipper & corner ties. Machine washable.`;
  return [
    sku, // Title（标题用 SKU，同 towel 惯例）
    sku, // URL handle
    descHtml, // Description
    'Makimoo', // Vendor
    'Home & Garden > Linens & Bedding > Bedding', // Product category
    'Bedding', // Type
    `Bedding, Duvet Cover Set, ${c.name}`, // Tags
    'TRUE', // Published on online store
    'Active', // Status
    sku, // SKU
    '', // Variant Barcodes
    'Title', 'Default Title', '', // Option1
    '', '', '', // Option2
    '', '', '', // Option3
    s.price, '', '', 'TRUE', '', // Price / Compare-at / Cost / Charge tax / Tax code
    '', '', '', '', // Unit price
    'shopify', '100', 'DENY', // Inventory
    String(s.grams), 'g', 'TRUE', 'manual', // Weight / shipping
    ...(withImg ? [imgUrl, '1', readableTitle, imgUrl] : ['', '', '', '']), // Images
    'FALSE', // Gift card
    readableTitle, seoDesc, // SEO
    '', // Color metafield 留空（该列是 metaobject 引用，纯文本会校验失败，同 towel 惯例）
    '', '', '', '', '', '', 'New', 'FALSE', // Google Shopping
    '', '', '', '', '', // Custom labels
    '', '', '', '', // Packed dims
  ].map(q).join(',');
}

const rowsA = [], rowsB = [];
for (const c of COLORS) {
  for (const s of SIZES) {
    rowsA.push(row(c, s, true));
    rowsB.push(row(c, s, false));
  }
}

const out = 'C:/Users/12021/Desktop/makimoo-duvset-16.csv';
try {
  fs.writeFileSync(out, '﻿' + HEADER.map(q).join(',') + '\r\n' + rowsA.join('\r\n') + '\r\n', 'utf8');
  console.log(`已生成 ${out}（${rowsA.length} 行，带图片 URL）`);
} catch (e) {
  console.warn(`跳过 ${out}：${e.code || e.message}（如在 Excel 中打开请先关闭）`);
}
const outB = 'C:/Users/12021/Desktop/makimoo-duvset-16-noimg.csv';
fs.writeFileSync(outB, HEADER.map(q).join(',') + '\r\n' + rowsB.join('\r\n') + '\r\n', 'utf8');
console.log(`已生成 ${outB}（${rowsB.length} 行，无 BOM 无图片）`);
